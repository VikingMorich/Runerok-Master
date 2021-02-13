import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import Button from './Button';
import fire from '../fire'
import Cookies from 'universal-cookie';

function useInput(initialValue){
    const [value,setValue] = useState(initialValue);
    function handleChange(e){
        setValue(e.target.value);
    }
    return [value,handleChange,setValue];
 }

export default function Room() {
    let cookies = new Cookies();
    const userName = cookies.get('userName')
    const [t] = useTranslation("global")
    const [message,changeMessage,setMessage] = useInput('');
    const [ready,setReady] = useState(false);

    const startGame = () => {
        if (ready) {
            toast.success("Comença el joc")
        } else {
            toast.warn(t('warnings.roomNotReady'));
        }
    }
    function handleSubmit(e){
        e.preventDefault()
        addMessageDB()
        setMessage('')
    }

    function toggleReady() {
        let ref = fire.database().ref().child('Room').child('Players').child(cookies.get('key'))
        let updates = {}
        updates['ready'] = !ready
        ref.update(updates)
        setReady(!ready)
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
        <div className="c-room">
            <h1 className="c-room--title">{t('room.title').toUpperCase()}</h1>
            <div className="c-room--top">
                <div className="c-room--game">
                    <div className="c-room--players" id="players">
                        
                    </div>
                    <div className="c-room--buttons">
                        <Button text={t('room.start').toUpperCase()} func={startGame}/>
                        <Button text={ready ? t('room.notReady').toUpperCase() : t('room.imReady').toUpperCase()} func={toggleReady}/>
                    </div>
                </div>
                <div className="c-room--chat-box">
                    <div id="chat" className="c-room--chat">
                    </div>
                    <React.Fragment>
                        <form method="POST" onSubmit={handleSubmit} className="c-chat">
                            <input placeholder={t("message")} value={message} onChange={changeMessage} className="c-chat--input" id="addMessage"/>
                            <button className="send-button">{t("submit").toUpperCase()}</button>
                        </form>
                    </React.Fragment>
                </div>
            </div>
        </div>
    );
}