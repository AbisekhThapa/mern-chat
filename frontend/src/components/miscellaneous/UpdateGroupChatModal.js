import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'

const UpdateGroupChatModal = ({ setFetchAgain, fetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { selectedChat, setSelectedChat, user } = ChatState()

    const [groupChatName, setGroupChatName] = useState(selectedChat?.chatName);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);

    const toast = useToast()


    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: 'Only admins can remove someone !',
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.put("/api/chat/groupremove",
                {
                    chatId: selectedChat._id,
                    userId: user1._id
                },
                config
            )
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages()
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Error occured',
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false)
        }
    }
    const handleAddUser = async (user1) => {
        if (selectedChat.users?.find((u) => u._id === user1._id)) {
            toast({
                title: 'Error occured',
                description: "User Already added!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only admins can add someone !',
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.put("/api/chat/groupadd",
                {
                    chatId: selectedChat._id,
                    userId: user1._id
                },
                config
            )
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Error occured',
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false)
        }

    }
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.get(`/api/user?search=${query}`, config)
            setSearchResult(data)
            setLoading(false)

        } catch (error) {
            toast({
                title: 'Error occured',
                description: "Error while getting data!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
            setLoading(false)
        }
    }
    const handleRename = async () => {
        if (!groupChatName) {
            toast({
                title: 'Please select all fields',
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }

        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put('api/chat/rename',
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                }
                , config
            )
            setSelectedChat(data)
            setFetchAgain(!fetchAgain);
            setRenameLoading(false)
            onClose();
            toast({
                title: 'Success',
                description: "New Group Chat created",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setSearch('')
            setGroupChatName(data?.chatName)
            setSearchResult([])
        } catch (error) {
            toast({
                title: 'Error occured',
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setRenameLoading(false)
        }

    }

    return (
        <div>
            <IconButton onClick={onOpen} icon={<ViewIcon />} isCentered />
            <Modal isOpen={isOpen} isCentered onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        display={'flex'}
                        justifyContent={'center'}
                        fontFamily={"poppins"}
                        fontSize={'35px'}
                    >
                        {selectedChat?.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={"flex"} flexDirection={"column"} alignContent={'center'}>
                        <Box w={"100%"} display="flex" flexWrap={'wrap'}>
                            {selectedChat?.users?.map((u) => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)} />
                            ))}
                        </Box>
                        <FormControl display={'flex'}>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => {
                                    setGroupChatName(e.target.value)
                                }}
                            />
                            <Button
                                variant={'solid'}
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameloading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add Users eg: John, Piysuh'
                                mb={1}
                                value={search}
                                onChange={(e) => {
                                    e.preventDefault();
                                    handleSearch(e.target.value)
                                }}
                            />
                        </FormControl>
                        {loading ? <Spinner /> : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => handleRemove(user)} >
                            Leave Group
                        </Button>
                        {/* <Button variant='ghost'>Secondary Action</Button> */}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default UpdateGroupChatModal