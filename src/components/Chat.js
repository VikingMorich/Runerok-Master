import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import fire from '../fire'
import Cookies from 'universal-cookie';

function useInput(initialValue){
    const [value,setValue] = useState(initialValue);
    function handleChange(e){
        setValue(e.target.value);
    }
    return [value,handleChange,setValue];
 }

export default function Chat(props) {
    let cookies = new Cookies();
    const userName = cookies.get('userName')
    const [t] = useTranslation("global")
    const [message,changeMessage,setMessage] = useInput('');

    function handleSubmit(e){
        e.preventDefault()
        addMessageDB()
        setMessage('')
    }

    function addMessageDB() {
            if (message === '') {
                alert('The player name must contain at lest 1 character')
            } else {
                fire.database().ref().child('Room').child('Chat').push().set({
                    message: message,
                    username: userName
                })
            }
    }

    return (
        <div className={props.type === "game" ? "c-room__chat-box--in-game" : "c-room__chat-box"}>
            <div id="chat" className="c-room--chat">
            </div>
            <form method="POST" onSubmit={handleSubmit} className="c-chat">
                <input placeholder={t("message")} value={message} onChange={changeMessage} className="c-chat--input" id="addMessage"/>
                <button className="send-button">{t("submit").toUpperCase()}</button>
            </form>
        </div>
    );
}

