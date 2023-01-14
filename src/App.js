import React, { useEffect, useState,  } from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from 'pusher-js';
import axios from './axios';

function App() {
// to connect backend from fronted we use useEffect.
const [messages, setMessages] = useState([]);
const [input, setInput] = useState("");

const sendMessage = async (e) => {
    
  e.preventDefault();
 console.log("called")
  await axios.post("/messages/new", {
    message: input,
    name: "DEMO APP",
    timestamp: new Date().getTime(),
    received: true,
  });
  setInput("")
};

useEffect(() => {
  axios.get(`/messages/sync`)
    .then(response => {
      setMessages(response.data);
    })
}, [input]);

useEffect(() => {
    const pusher = new Pusher('cbf0d27758ab4bf297a0', {
      cluster: 'ap2'
    });
    console.log("yeas")
    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage)=> {
      alert(JSON.stringify(newMessage));
      setMessages([...messages, newMessage]);
    });

    return () => {
      
    }
  }, [messages]);

  console.log(messages);


  return (
    <div className="app">
    <div className="app__body">
        <Sidebar />
        <Chat 
        messages = {messages}
        setInput={setInput}
        sendMessage = {sendMessage}
        input={input}
         />
      </div>
    </div>
  );
}

export default App;
