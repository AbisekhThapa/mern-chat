import { ViewIcon } from '@chakra-ui/icons'
import {
    IconButton, useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Image,
    Text,
} from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Modal size={'md'} isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize="40px" fontFamily={'poppins'} display="flex" justifyContent={"center"}>{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'space-between'} gap={4}>
                        <Image src={user.pic} borderRadius={'full'} boxSize={'150px'} alt={user.name} />
                        <Text fontSize={'2xl'} color={'gray.500'}>Email: {user.email}</Text>
                    </ModalBody>
                    {/* <ModalFooter>
                        <Button mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter> */}
                </ModalContent>
            </Modal>
            {children ?
                <span onClick={onOpen}>{children}</span>
                :
                <IconButton
                    display={'flex'}
                    icon={<ViewIcon />}
                    onClick={onOpen}
                />}
        </>
    )
}

export default ProfileModal