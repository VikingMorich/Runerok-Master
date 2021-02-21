import React, {useState} from 'react';
import { useTranslation } from "react-i18next";
import Chat from './Chat'
import { Valknut, Skull, Rune } from './icon/icon';
import Button from './Button';
import fire from '../fire'
import Cookies from 'universal-cookie';

export default function Game() {
    let cookies = new Cookies();
    const [t] = useTranslation("global")
    const [alive,setAlive] = useState(true);
    const diceTypes = {
        "green": ["rune", "rune", "rune", "ship", "valknut", "damage"],
        "yellow": ["rune", "rune", "ship", "valknut", "damage", "damage"],
        "red": ["rune", "valknut", "ship", "damage", "damage", "damage"]
    }
    const diceNumber = {
        "green": 9,
        "yellow": 9,
        "red": 9
    }

    const getRandomInt = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    }

    const getRandomDicePosition = () => {
        let arrayDices = []
        Object.keys(diceNumber).forEach(element => {
            for (let i = 0; i < diceNumber[element]; i++) {
                arrayDices.push(element)
            }
        });
        arrayDices = arrayDices.sort(function() {return Math.random() - 0.5})
        return arrayDices
    }

    const RollDices = () => {
        let dices = document.getElementById('selected-dices').childNodes
        const diceNumber = dices.length
        let instanceDices =  { ...dices }
        let arrayValues = []
        let currentGameState = fire.database().ref("Room/Game/Stats")
        for (let i = 0; i < diceNumber; i++) {
            let str = instanceDices[i].id
            let res = str.replace("-selected", "");
            let ref = fire.database().ref("Room/Game/Dices/" + res)
            let updates = {}
            
            let randVal = getRandomInt(6)
            let color = instanceDices[i].className
            let value = diceTypes[color][randVal]
            if (value !== 'ship') {
                updates['used'] = true
            }
            updates['value'] = value
            arrayValues.push(value)
            ref.update(updates)
        }
        currentGameState.once("value", function(gameStateSnap) {
            let playerTurn = gameStateSnap.val().turn
            let currentPlayerState = fire.database().ref("Room/Players/"+playerTurn)
            currentPlayerState.once("value", function(snap) {
                let updatePlayerState = {}
                let countDamage = 0
                let countValknut = 0
                arrayValues.forEach(element => {
                    if (element === 'damage') {
                        countDamage += 1
                        updatePlayerState['lives'] = snap.val().lives - countDamage
                        if (snap.val().lives - countDamage <= 0){
                            setAlive(false)
                        }
                    }
                    if (element === 'valknut') {
                        countValknut += 1
                        updatePlayerState['valknut'] = snap.val().valknut + countValknut
                    }
                    if (element === 'rune') {
                        let countRunes = 0
                        let updateGameState = {}
                        if(snap.val().lives >= 0) {
                            currentGameState.once("value", function(snap) {
                                countRunes += 1
                                updateGameState['partialRunes'] = snap.val().partialRunes + countRunes
                            })
                            currentGameState.update(updateGameState)
                        }
                    }
                    if (element === 'ship') {
                        //fet a dalt, nomes mante el dau i fica l'icona
                    }
                })
                currentPlayerState.update(updatePlayerState)
            })
        })
        
    }
    const giveUp = () => {
        let ref = fire.database().ref("Room/Game/Dices/")
        let randomDicePosition = getRandomDicePosition()
        let updates = {}
        randomDicePosition.forEach((element, key) => {
            updates[(key+1)] = {
                "color": element,
            }
        });
        ref.update(updates)
        let currentGameState = fire.database().ref("Room/Game/Stats")
        currentGameState.once("value", function(gameStateSnap) {
            let playerTurn = gameStateSnap.val().turn
            let currentPlayerState = fire.database().ref("Room/Players/"+playerTurn)
            currentPlayerState.once("value", function(snap) {
                let updateGameState = {}
                let currentPlayerRunes = snap.val().runes
                let currentPlayerLives = snap.val().lives
                let updatePlayerState = {
                    "lives": 3,
                }
                currentGameState.once("value", function(snapshot) {
                    if (currentPlayerLives > 0) {
                        updatePlayerState['runes'] = currentPlayerRunes + snapshot.val().partialRunes
                    }
                    updateGameState['partialRunes'] = 0
                    currentGameState.update(updateGameState)
                    currentPlayerState.update(updatePlayerState)
                })
            })
        })
        setAlive(true)
        let refTurn = fire.database().ref("Room/Game/Stats/")
        let updatesTurn = {}
        updatesTurn['giveup'] = true
        refTurn.once("value", function(gameStateSnap) {
            let arrayPlayers = gameStateSnap.val().orderPlayers
            let currentPlayer = arrayPlayers[0]
            let newArrayPlayers = [...arrayPlayers]
            newArrayPlayers.shift()
            newArrayPlayers.push(currentPlayer)
            debugger
            updatesTurn['turn'] = newArrayPlayers[0]
            updatesTurn['orderPlayers'] = newArrayPlayers
            refTurn.update(updatesTurn)
        })
    }

    const ExitGame = () => {
        window.location.href = '/room'
    }

    return (
        <div className="c-game">
            <div className="c-game__players">
                <h1 className="c-game--title">{t('game.players').toUpperCase()}</h1>
                <div id="players" className="c-game__players--players">
                    
                </div>
                <div className="c-game__exit">
                    <Button text={t('game.exit').toUpperCase()} func={ExitGame}/>
                </div>
            </div>
            <div className="c-game__game">
                <h1 className="c-game--title">{t('game.title')}<span id="turn-title"></span></h1>
                <div className="c-game__dices" id="game-dices">
                    
                </div>
                <div className="c-game__interface">
                    {!alive ? 
                    <React.Fragment>
                        <div className="c-game__skull">
                            <Skull/>
                        </div>
                        <span className="c-game__skull--text">{t('game.dead').toUpperCase()}</span>
                        <Button text={t('game.changeTurn').toUpperCase()} func={giveUp}/> 
                        <div id="in-game-buttons">
                            
                        </div>
                        <span id="partial-runes"></span>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <div className="c-game__selectedDices">
                            <span>{t('game.selectedDices').toUpperCase()}</span>
                            <div className="c-game__selected-wrapper" id="selected-dices">

                            </div>
                        </div>
                        <div>
                            <Button text={t('game.roll').toUpperCase()} func={RollDices}/>
                            <Button text={t('game.giveUp').toUpperCase()} func={giveUp}/>
                        </div>
                        <div id="in-game-buttons">
                            
                        </div>
                        <div className="c-game__partialRunes">
                            <span>{t('game.partialRunes').toUpperCase()}</span>
                            <span id="partial-runes"></span>
                            <div className="c-game__rune--watermark">
                                <Rune />
                            </div>
                        </div>
                    </React.Fragment>
                     }
                    
                </div>
                <Chat type="game"/>
            </div>
            <div className="c-game__actions">
                <h1 className="c-game--title">{t('game.actions').toUpperCase()}</h1>
                <div className="c-game__actions--container" id="actions-container">

                </div>
                <div className="c-game__actions--value" id="valknut-points">
                    <div className="c-game__actions--valknut">
                        <Valknut />
                    </div>
                </div>
            </div>
        </div>
    );
}