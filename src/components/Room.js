import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import Button from './Button';
import fire from '../fire'
import Chat from './Chat'
import Cookies from 'universal-cookie';

export default function Room() {
    let cookies = new Cookies();
    const [t] = useTranslation("global")
    const [ready,setReady] = useState(false);

    const startGame = () => {
        if (ready) {
            toast.success("Comença el joc")
            let ref = fire.database().ref().child('Room').child('Game').child('Dices')
            let refStats = fire.database().ref("Room/Game/Stats")
            let refPlayers = fire.database().ref("Room/Players")
            let updates = {
                "1": {
                    "color": "green"
                },
                "2": {
                    "color": "yellow"
                },
                "3": {
                    "color": "red",
                },
                "4": {
                    "color": "red",
                },
                "5": {
                    "color": "red",
                },
                "6": {
                    "color": "red",
                },
                "7": {
                    "color": "red",
                },
                "8": {
                    "color": "red",
                },
                "9": {
                    "color": "red",
                },
                "10": {
                    "color": "red",
                },
                "11": {
                    "color": "red",
                },
                "12": {
                    "color": "red",
                },
                "13": {
                    "color": "red",
                },
                "14": {
                    "color": "red",
                },
                "15": {
                    "color": "red",
                },
                "16": {
                    "color": "red",
                },
                "17": {
                    "color": "red",
                },
                "18": {
                    "color": "red",
                },
                "19": {
                    "color": "red",
                },
                "20": {
                    "color": "red",
                },
                "21": {
                    "color": "red",
                },
                "22": {
                    "color": "red",
                },
                "23": {
                    "color": "red",
                },
                "24": {
                    "color": "red",
                },
                "25": {
                    "color": "red",
                },
                "26": {
                    "color": "red",
                },
                "27": {
                    "color": "red",
                }
            }
            let updateStats = {}
            refPlayers.once("value", function(playersSnap) {
                let arrayPlayers = Object.keys(playersSnap.val())
                arrayPlayers = arrayPlayers.sort(function() {return Math.random() - 0.5})
                updateStats['turn'] = arrayPlayers[0]
                updateStats['orderPlayers'] = arrayPlayers
                refStats.update(updateStats)
                ref.update(updates)
            })
            window.location.href = '/game'
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