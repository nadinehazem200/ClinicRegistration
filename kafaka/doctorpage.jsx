// DoctorPage.js

import React, { useState } from 'react';

const DoctorPage = () => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      // Make a fetch request to your server, which communicates with Kafka
      const response = await fetch('/api/fetch-messages');
      const data = await response.json();

      // Update the state with the fetched messages
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  };

  return (
    <div>
      <h1>Doctor's Page</h1>
      <button onClick={fetchMessages}>Fetch Messages</button>

      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{JSON.stringify(message)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorPage;
