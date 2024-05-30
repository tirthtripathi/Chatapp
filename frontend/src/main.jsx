import React from 'react';
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import necessary components
import { ChakraProvider } from '@chakra-ui/react';
import HomePage from './Pages/HomePage.jsx';
import ChatPage from './Pages/ChatPage.jsx';
import ChatProvider from './context/ChatProvider.jsx';
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(

 
      <ChakraProvider>
      <BrowserRouter>
      <ChatProvider>
        <Routes>
         <Route path='/' element={<App />}>
          <Route path="/" element={<HomePage />}>
          </Route>
            {/* Define child routes here if HomePage has nested routes */}
            <Route path="/chat" element={<ChatPage/>}/>
          </Route>
          {/* Add more routes as needed */}
        </Routes>
        </ChatProvider>
        </BrowserRouter>
      </ChakraProvider>
    
 
 
);


