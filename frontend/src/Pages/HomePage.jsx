import React, { useEffect } from 'react'
import { Container, Box, Text, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'
import {useNavigate} from "react-router-dom";
const HomePage = () => {
  
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if(user){
      navigate("/chat");
    }
  },[navigate]);
  
  return (
    <Container maxW="md" centerContent  d="flex" alignItems="center" justifyContent="center" flexDirection="column" gap={5}>
      <Box
        d="flex"
        justifyContent='center'
        bg={"white"}
        w="100%"
        marginTop={4}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          d='flex'
          textAlign='center'
          fontSize="4xl"
          padding={4}
          fontFamily="Work+Sans"
        >Panchayat </Text>

      </Box>
      <Box bg="white" w="100%" borderRadius="lg" p={4} borderWidth="1px" color="black" >
        <Tabs variant='soft-rounded'>
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage