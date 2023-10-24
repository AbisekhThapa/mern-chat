import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/miscellaneous/SideDrawer'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'

const Chat = () => {

  const { user, setuser } = ChatState();
  console.log("🚀 ~ file: Chat.js:11 ~ Chat ~ user:", user)
  var userInfo = JSON.parse(localStorage.getItem("userInfo"));


  const [fetchAgain, setFetchAgain] = useState(false)
  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}
      <Box display={"flex"} justifyContent={"space-between"} w='100%' h='88vh' p="10px">
        {user && (
          <>
            <MyChats fetchAgain={fetchAgain} />
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </>)}
      </Box>
    </div>
  )
}

export default Chat