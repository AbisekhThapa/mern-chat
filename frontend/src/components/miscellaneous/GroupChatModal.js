import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, useDisclosure, Button, useToast, FormControl, Input, Spinner, Box
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState()

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
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
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
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post('api/chat/group',
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id))
                }
                , config
            )
            setChats([data, ...chats])
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
            setGroupChatName('')
            setSearchResult([])
            setSelectedUsers([])

        } catch (error) {
            toast({
                title: 'Error occured',
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
    }
    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter(sel => sel._id !== userToDelete._id))
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'Error occured',
                description: "User Already added!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd])
        setSearch('')
        setSearchResult([])
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} isCentered onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        display={'flex'}
                        justifyContent={'center'}
                        fontFamily={"poppins"}
                        fontSize={'35px'}
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={"flex"} flexDirection={"column"} alignContent={'center'}>
                        <FormControl>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
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
                        <Box w={"100%"} display="flex" flexWrap={'wrap'}>
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)} />
                            ))}
                        </Box>
                        {loading ? <Spinner /> : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                            Create Chat
                        </Button>
                        {/* <Button variant='ghost'>Secondary Action</Button> */}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal