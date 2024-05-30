import React, { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { Box, Text, IconButton, Spinner, FormControl, Input, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css';
import ScrollableChat from './ScrollableChat';
import Lottie from 'react-lottie'
import animationData from '../assets/TypingAnimation.json'
import io from 'socket.io-client';



const ENDPOINT = "https://panchayat-8mwo.onrender.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);


    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
    }

    const toast = useToast();
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

            setMessages(data);
            setLoading(false);

            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            toast({
                title: "Error!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    };

    const sendMessage = async () => {
        if (!newMessage) return;
         socket.emit('stop typing',selectedChat._id);
        try {
            const config = {
                headers: {
                    "Content-type": 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post('/api/message', {
                content: newMessage,
                chatId: selectedChat._id,
            }, config);

            setNewMessage('');

            // Ensure the emitted data structure is correct
            const messageData = {
                content: data.content,
                chat: data.chat,
                sender: user
            };

            socket.emit('new message', messageData);
            setMessages((prevMessages) => [...prevMessages, data]);
        } catch (error) {
            toast({
                title: "Error!",
                description: "Failed to send the Message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing',() => setIsTyping(true));
        socket.on('stop typing',() => setIsTyping(false));

        // Listening for incoming messages
        socket.on('message received', (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                 if(!notification.includes(newMessageReceived)){
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                 }
            } else {
                setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
            }
        });

        return () => {
            socket.off('message received');
        };
    }, []);
    
    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit('typing', selectedChat._id)
        }

        let lastTypingTime = new Date().getTime()
        var timerLength = 2000;

        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDeff = timeNow - lastTypingTime;

            if(timeDeff >= timerLength && typing){
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        },timerLength);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work+Sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                            {getSender(user, selectedChat.users) ? getSender(user, selectedChat.users).toUpperCase() : "Unknown Sender"}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}
                    </Text>
                    <Box
                        position="relative"
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="auto"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className="messages" style={{}}>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl
                            display="flex"
                            margin={0}
                            left={0}
                            right={0}
                            bottom={0}
                            flexDirection='column'
                            position="absolute"
                            mt={3}
                        >
                        <div>
                          {isTyping ? <div>
                            <Lottie 
                                options={defaultOptions}
                                width={70}
                                style={{marginBottom:0, marginLeft:0}}
                            />
                          </div>: (<></>)}
                         </div>
                         <div 
                         style={{
                            display : 'flex'
                         }}
                         >
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder="Enter a message..."
                                autoComplete="off"
                                onChange={typingHandler}
                                value={newMessage}
                            />
                            <IconButton
                                icon={<i className="fa-regular fa-paper-plane"></i>}
                                onClick={sendMessage}
                            />
                        </div>
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work+Sans">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;
