import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { ChatState } from '../../context/ChatProvider'

const Signup = () => {
  const [show, setShow] = useState(false)
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirmpassword, setConfirmPassword] = useState()
  const [pic, setPic] = useState()
  const [loading, setLoading] = useState(false)
  const [picLoading, setPicLoading] = useState(false)
  const toast = useToast()
  const history = useHistory()

  const { setUser } = ChatState()

  const postDetails = (pic) => {
    setLoading(true)
    if (pic === undefined) {
      toast({
        title: 'Please select Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chatApp");
      data.append("cloud_name", "dwbbjk055");
      fetch("https://api.cloudinary.com/v1_1/dwbbjk055/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false)
        })
        .catch((err) => {
          console.log(err);
          setLoading(false)
        })
    } else {
      toast({
        title: 'Please select Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom '
      })
      setLoading(false);
      return;
    }

  }

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      setPicLoading(false);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data)
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };
  return (
    <VStack spacing={5} >
      <FormControl id='first-name' isRequired>
        <FormLabel>
          Name
        </FormLabel>
        <Input
          placeholder='Enter your name.'
          onChange={(e) => setName(e.target.value)}
          borderRadius={0}
        />
      </FormControl>
      <FormControl id='email' isRequired>
        <FormLabel>
          Email
        </FormLabel>
        <Input
          placeholder='Enter your email.'
          type='email'
          onChange={(e) => setEmail(e.target.value)}
          borderRadius={0}
        />
      </FormControl>
      <FormControl id='confirm-password' isRequired>
        <FormLabel>
          Password
        </FormLabel>
        <InputGroup>
          <Input
            placeholder='Enter your password.'
            type={show ? 'text' : 'password'}
            onChange={(e) => setPassword(e.target.value)}
            borderRadius={0}
          />
          <InputRightElement width={"4.5rem"} >
            <Button h='1.75rem' size={"sm"} onClick={() => setShow(!show)}>
              {show ? 'Hide' : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl><FormControl id='password' isRequired>
        <FormLabel>
          Confirm Password
        </FormLabel>
        <InputGroup>
          <Input
            placeholder='Confirm password.'
            type={show ? 'text' : 'password'}
            onChange={(e) => setConfirmPassword(e.target.value)}
            borderRadius={0}
          />
          <InputRightElement width={"4.5rem"} >
            <Button h='1.75rem' size={"sm"} onClick={() => setShow(!show)}>
              {show ? 'Hide' : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='pic'>
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type='file'
          p={1.5}
          accept='image/*'
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme='blue'
        width={'100%'}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading || picLoading}
      >
        Sign up
      </Button>

    </VStack>
  )
}

export default Signup