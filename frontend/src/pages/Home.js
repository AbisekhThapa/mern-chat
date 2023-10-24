import React, { useEffect } from 'react'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react"
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useHistory } from 'react-router-dom'

const Home = () => {
  const history = useHistory()

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))

    if (userInfo) {
      history.push("/chats");
    }
  }, [history])

  return (
    <Container maxW='xl' centerContent>
      <Box display='flex' justifyContent={'center'} p={3} bg={'white'} w="100%" m={"40px 0 15px 0"} borderRadius={'lg'} borderWidth={'1px'}>
        <Text fontSize={"4xl"} fontFamily={"poppins"} color={'black'}>Talk-A-Tive</Text>
      </Box>
      <Box display='flex' justifyContent={'center'} p={3} bg={'white'} w="100%" m={"4px 0 15px 0"} borderRadius={'lg'} borderWidth={'1px'}>
        <Tabs variant='soft-rounded' width={"full"} >
          <TabList >
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home