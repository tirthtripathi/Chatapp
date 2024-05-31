import React, { useState } from 'react'
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Signup = () => {
    // States
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [show, setShow] = useState(false);
    const [loding, setLoading] = useState(false);

    const toast = useToast();
    const navigation = useNavigate();

    // Functions 
    const handleClick = () => setShow(!show);

    const postDetails = (pics) => {
        setLoading(true);
        // if (pic === undefined) {
        //     toast({
        //         title: 'Please Select an Image!',
        //         status: 'warning',
        //         duration: 5000,
        //         isClosable: true,
        //         position: "top-right"
        //     })
        // }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "panchayat");
            data.append("cloud_name", "djjdlywuw")

            fetch("https://api.cloudinary.com/v1_1/djjdlywuw/image/upload", {
                method: 'post',
                body: data,
            }).then((res) => res.json())
                .then(data => {
                    
                    setPic(data.url.toString());
                  
                    console.log(data.url.toString());
                    setLoading(false);
                }).catch((err) => {
                    console.log(err);
                    setLoading(false);
                })
        } else {
            toast({
                title: "Please Select an Image of JPEG or PNG",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            setLoading(false);
            return;
        }
    };

    const SubmitHandler = async () => { 
       setLoading(true);
       if(!name || !email || !password || !confirmpassword){
         toast({
            title: "Please Fill all the Feilds",
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: "top"
         })
         setLoading(false);
         return;
       }
       if(password !== confirmpassword){

        toast({
            title: "Password and Confirmpassword are not same",
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: "top"
         })
         return;
       }
       try {
        const config = {
            headers: {
                "Content-type" :  "application/json",
            },
        };
        const {data} =  await axios.post(
            "https://panchayat-frn1.onrender.com/api/user",
            {name, email, password, pic},
            config
        );
        toast({
            title: "Regestration Successful",
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: "top"
         });

         localStorage.setItem('userInfo', JSON.stringify(data));

         setLoading(false);

         navigation('/chat');
         
       } catch (error) {
        toast({
            title: "Password and Confirmpassword are not same",
            description:error.response.data.message,
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: "top"
         })
         setLoading(false);
       }
    };


    return (
        <VStack spacing="5px" as='b'>
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder="Enter Your Name"
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>

            <FormControl id='Semail' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder="Enter Your Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id='Spassword' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter Your Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h='1.75rem' size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>

                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='confirmPassword' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h='1.75rem' size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>

                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='pic' isRequired>
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept='image/*'
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>

            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={SubmitHandler}
                isLoading={loding}
            >
                Signup
            </Button>

        </VStack>
    )
}

export default Signup