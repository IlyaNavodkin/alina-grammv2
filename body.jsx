import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";

const Body = ({ socket, selectedContact, activeUser }) => {
    const navigate = useNavigate();
    const messagesContainerRef = useRef(null);
    const [contactMessages, setContactMessages] = useState([]);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        const handleResponseContactMessages = (messages) => {
            setContactMessages(messages);
        };

        const handleReceiveSendMessage = (message) => {
            setContactMessages((prevMessages) => [...prevMessages, message]);
        };

        socket.on("responseContactMessages", handleResponseContactMessages);
        socket.on("receiveSendMessage", handleReceiveSendMessage);

        return () => {
            socket.off("responseContactMessages", handleResponseContactMessages);
            socket.off("receiveSendMessage", handleReceiveSendMessage);
        };
    }, [socket, selectedContact]);

    useLayoutEffect(() => {
        scrollToBottom();
    }, [contactMessages]);

    const handleLeave = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <>
            <header className={styles.header}>
                {selectedContact && (
                    <div className={styles.selectedContact}>
                        <h4>Выбранный контакт:</h4>
                        <p>UserFrom: {selectedContact.userFrom}</p>
                        <p>UserTo: {selectedContact.userTo}</p>
                    </div>
                )}

                <button className={styles.btn} onClick={handleLeave}>
                    Покинуть чат
                </button>
            </header>

            <div className={styles.container} ref={messagesContainerRef}>
                {contactMessages.map((message, index) => (
                    <div className={styles.chats} key={index}>
                        <p className={message.userId === activeUser.id ? styles.senderName : styles.recieverName}>
                            {message.userId}
                        </p>
                        <div
                            className={message.userId === activeUser.id ? styles.messageSender : styles.messageReciever}
                        >
                            <p>{message.content}</p>
                        </div>
                    </div>
                ))}

                <div className={styles.typingStatus}>
                    <p>....</p>
                </div>
            </div>
        </>
    );
};

export default Body;
