import React from 'react';
import { useTranslation } from "react-i18next";
import Button from './Button';
import Chat from './Chat'
import { checkPlayersReady, changeGameMode } from './GameFunctions'

export default function Room() {
    const [t] = useTranslation("global")

    return (
        <div className="c-room">
            <h1 className="c-room--title">{t('room.title').toUpperCase()}</h1>
            <div className="c-room--top">
                <div className="c-room--game">
                    <div className="c-room--players" id="players">
                        
                    </div>
                    <div className="c-room--buttons">
                        <Button text={t('room.start').toUpperCase()} func={()=>checkPlayersReady(t)}/>
                        <div id="room-ready-btn" />
                    </div>
                    <div className="c-room--buttons">
                        <div className="game-mode-button" onClick={changeGameMode}>
                            <span>{t('room.gameMode') + ' - '}</span>
                            <span id="game-mode-button" />
                        </div>
                    </div>
                </div>
                <Chat/>
            </div>
        </div>
    );
}