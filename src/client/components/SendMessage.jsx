import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SendMessageComponent = () => {
  const [message, setMessage] = useState("");
  const { receiverId } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender_id: userId,
          receiver_id: receiverId,
          content: message,
        }),
      });

      if (!response.ok) {
        alert("Failed to send message");
      }

      setMessage("");
      navigate(-1);
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <div className="send-message-container">
      <form onSubmit={sendMessage} className="send-message-form">
        <textarea
          className="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        ></textarea>
        <button type="submit" className="send-message-button">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default SendMessageComponent;
