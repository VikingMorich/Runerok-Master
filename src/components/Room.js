import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import Button from './Button';
import fire from '../fire'
import Chat from './Chat'
import Cookies from 'universal-cookie';
import { createNewGame } from './GameFunctions'

export default function Room() {
    let cookies = new Cookies();
    const [t] = useTranslation("global")
    const [ready,setReady] = useState(false);

    const startGame = () => {
        if (ready) {
            toast.success("Comença el joc")
            createNewGame()
        } else {
            toast.warn(t('warnings.roomNotReady'));
        }
    }

    function toggleReady() {
        let ref = fire.database().ref().child('Room').child('Players').child(cookies.get('key'))
        let updates = {}
        updates['ready'] = !ready
        ref.update(updates)
        setReady(!ready)
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
                <Chat/>
            </div>
        </div>
    );
}