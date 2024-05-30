import React from 'react'
import ScrollableFeed from 'react-scrollable-feed';
import {Tooltip, Avatar} from '@chakra-ui/react' 
import {isSameSender, isLastMessage, isSameSenderMargin} from '../config/ChatLogics'
import { ChatState } from '../context/ChatProvider';


const ScrollableChat = ({messages}) => {

    const {user} = ChatState();
  return (
    <ScrollableFeed>
        {messages && messages.map((m, i) => (
            <div style={{display:'flex'}} key={m._id}>
                {
                    (isSameSender(messages,m,i,user._id)
                     || isLastMessage(messages,i,user._id)
                    ) &&(
                        <Tooltip
                         label={m.sender.name}
                         placement='bottom-start'
                         hasArrow
                        > 
                        <Avatar 
                        mt='7px'
                        mr={1}
                        size='sm'
                        cursor='pointer'
                        name={m.sender.name}
                        src={m.sender.pic}
                        />
                        </Tooltip>
                    )}
                    <span style={{
                        backgroundColor: `${
                            m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                        }`,
                        borderRadius: m.sender._id === user._id ? "20px" : "10px",
                        padding:"5px 15px",
                        maxWidth:"75%",
                        marginLeft: isSameSenderMargin(messages, m, i, user._id),
                        marginTop: isSameSender(messages, m, i, user._id) ? '1px' : '10'
                    }}>
                     {m.content}
                    </span>
    
            </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat