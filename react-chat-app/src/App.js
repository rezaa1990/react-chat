import './App.css';
import Chat from './components/chat';
import Login from './components/login';
import RegisterForm from './components/register';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChatProvider } from "./components/context";

function App() {
 return (
   <ChatProvider>
     <Router>
       <div className="App">
         <Routes>
           <Route path="/" element={<Login />} />
           <Route path="/register" element={<RegisterForm />} />
           <Route path="/chat" element={<Chat />} />
         </Routes>
       </div>
     </Router>
   </ChatProvider>
 );
}

export default App;
