import React from 'react';
import {Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,} from '@chakra-ui/react';
import { useDisclosure, IconButton, Image, Text } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
// import { ChatState } from '../../context/ChatProvider';


const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          margin={1}
          aria-label="Open profile modal"
          icon={<InfoIcon />}
          onClick={onOpen}
          variant="outline" 
          size="lg"
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent padding={4}>
          <ModalHeader
          fontSize='40px'
          fontFamily='Work+Sans'
          display='flex'
          justifyContent='center'
           >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display='flex'
            flexDirection='column'
            justifyContent='center'
            gap='5'
          >
          <div style={{display:'flex', justifyContent:"center"}}>
             <Image
              borderRadius='full'
              src={user.pic}
              alt={user.name}
              boxSize='200px'
              display='flex'
              justifyContent='center'
             />
          </div>
             <Text 
             fontSize={{base:'20px', md:'20px'}}
             fontFamily='Work+Sans'
             display='flex'
             textAlign='center'
             justifyContent='center'
             >Email:{user.email}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
