import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import { getSender } from '../config/ChatLogic';
import ChatLoading from './ChatLoading';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setloading] = useState(false);
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState()

  const toast = useToast()

  const fetchChats = async () => {
    try {
      setloading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.get("/api/chat", config);
      setChats(data)
      setloading(false)
    } catch (error) {
      toast({
        title: 'Error occured',
        description: "Error while getting data!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
      setloading(false)
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain])
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text>My Chats</Text>
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        // h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {loading ? <>
          <ChatLoading />
        </> : chats.length > 0 ? (
          <Stack overflowY="auto">
            {chats?.map((chat) => (
              <Box
                onClick={() => {
                  setSelectedChat(chat)
                }}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroup
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <Text textAlign={'center'}>No user added.</Text>
        )}
      </Box>
    </Box>
  )
}

export default MyChats