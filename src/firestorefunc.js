import firebase from 'firebase'
import React from 'react'
import RoomPlayer from './components/RoomPlayer'
import GamePlayer from './components/GamePlayer'
import GameAction from './components/GameAction'
import PlayerDeadView from './components/PlayerDeadView'
import Dice from './components/dice/dice'
import ReactDOM from 'react-dom'
import Cookies from 'universal-cookie'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Button from './components/Button'
import RollingDice from './components/RollingDice'
import { rollDices, giveUp, toggleReady } from './components/GameFunctions'
import { Ship, Damage, Rune, Valknut, Skull, Beer, Shield, Helmet, Horn, Critical, Ham, Thunder, Mushroom, Book, Raven, Dragon } from './components/icon/icon';


export function initFirebase(i18n) {
    let cookies = new Cookies();
    let dbRefPlayers = firebase.database().ref().child('Room').child('Players')
    let dbRefChat = firebase.database().ref().child('Room').child('Chat')
    let dbRefGameActions = firebase.database().ref().child('Room').child('Game').child('Actions')
    let dbRefGameDices = firebase.database().ref().child('Room').child('Game').child('Dices')
    let dbRefGameStats = firebase.database().ref().child('Room').child('Game').child('Stats')
    let dbRefGameMode = firebase.database().ref().child('Room').child('RoomState')
    let even = false

    // db functions working

    dbRefGameStats.on('child_added', snap => {
        if(window.location.pathname === '/game') {
            if (snap.key === 'orderPlayers') {
                let objPlayers = document.getElementById('players')
                let arrayPlayers = snap.val()
                Object.keys(arrayPlayers).forEach(element => {
                    let playerChanged = document.getElementById(arrayPlayers[element])
                    const user = document.createElement('div')
                    user.id=arrayPlayers[element]
                    user.className="c-roomPlayer__container"
                    objPlayers.appendChild(user)
                    let currentPlayerStats = firebase.database().ref("Room/Players/"+arrayPlayers[element] )
                    currentPlayerStats.once("value", function(snapshot) {
                        let dbGameStats = firebase.database().ref("Room/Game/Stats")
                        dbGameStats.once("value", function(gameStatsSnap) {
                            let currentGameMode = firebase.database().ref("Room/RoomState")
                            currentGameMode.once("value", function(gameModeSnap) {
                                let gamePlayerData = {
                                    userName: snapshot.val().username,
                                    userTurn: arrayPlayers[0] === snapshot.key,
                                    imageUrl: snapshot.val().imageUrl,
                                    runes: snapshot.val().runes,
                                    lives: snapshot.val().lives,
                                    valknut: snapshot.val().valknut,
                                    helmet: snapshot.val().helmet,
                                    helmetUsed: snapshot.val().helmetUsed,
                                    shield: snapshot.val().shield,
                                    shieldUsed: snapshot.val().shieldUsed,
                                    gameMode: gameModeSnap.val().gameMode,
                                    extraTurn: gameStatsSnap.val().extraTurn,
                                    state: snapshot.val().state,
                                    bookLvl: snapshot.val().bookLvl,
                                    malediction: snapshot.val().malediction,
                                }
                                ReactDOM.render(<GamePlayer i18n={i18n} gamePlayerData={gamePlayerData}/>, user) 
                            })
                            if (playerChanged){
                                objPlayers.replaceChild(user, playerChanged)
                            }
                        })
                    })
                })
            }
            if (snap.key === 'partialRunes' && document.getElementById('partial-runes')) {
                document.getElementById('partial-runes').innerText = snap.val()
            }
            if (snap.key === 'turn' && document.getElementById('selected-dices')) {
                let objSelectedDices = document.getElementById('selected-dices')
                let diceChilds = [...objSelectedDices.childNodes]
                diceChilds.forEach(element => {
                    element.remove()
                })
                let currentPlayerTurn = firebase.database().ref("Room/Players/"+snap.val() )
                currentPlayerTurn.once("value", function(snapshot) {
                    if (snapshot.val()){
                    document.getElementById('turn-title').innerText = snapshot.val().username
                        let currentGStats = firebase.database().ref("Room/Game/Stats" )
                        currentGStats.once("value", function(gameSnap) {
                            let objPlayers = document.getElementById('players')
                            let arrayPlayers = gameSnap.val().orderPlayers
                            Object.keys(arrayPlayers).forEach(element => {
                                let playerChanged = document.getElementById(arrayPlayers[element])
                                const user = document.createElement('div')
                                user.id=arrayPlayers[element]
                                user.className="c-roomPlayer__container"
                                objPlayers.appendChild(user)
                                let currentPlayerStats = firebase.database().ref("Room/Players/"+arrayPlayers[element] )
                                currentPlayerStats.once("value", function(snapshot) {
                                    if (snapshot.val()) {
                                        let currentGameMode = firebase.database().ref("Room/RoomState")
                                        currentGameMode.once("value", function(gameModeSnap) {
                                            let gamePlayerData = {
                                                userName: snapshot.val().username,
                                                userTurn: snap.val() === snapshot.key,
                                                imageUrl: snapshot.val().imageUrl,
                                                runes: snapshot.val().runes,
                                                lives: snapshot.val().lives,
                                                valknut: snapshot.val().valknut,
                                                helmet: snapshot.val().helmet,
                                                helmetUsed: snapshot.val().helmetUsed,
                                                shield: snapshot.val().shield,
                                                shieldUsed: snapshot.val().shieldUsed,
                                                gameMode: gameModeSnap.val().gameMode,
                                                extraTurn: gameSnap.val().extraTurn,
                                                state: snapshot.val().state,
                                                bookLvl: snapshot.val().bookLvl,
                                                malediction: snapshot.val().malediction,
                                            }
                                            ReactDOM.render(<GamePlayer i18n={i18n} gamePlayerData={gamePlayerData}/>, user)
                                        })
                                        if (playerChanged){
                                            objPlayers.replaceChild(user, playerChanged)
                                        }
                                    }
                                })
                            })
                        })
                    }
                })
                let objActions = document.getElementById('actions-container')
                const actionButtons = document.createElement('div')
                actionButtons.id = 'action-buttons'
                actionButtons.className = "c-game__actions--container"
                let currentPlayerStats = firebase.database().ref("Room/Players/"+cookies.get('key'))
                let defgameMode = firebase.database().ref("Room/RoomState")
                defgameMode.once("value", function(roomStateSnap) {
                    currentPlayerStats.once("value", function(snapshot) {
                        objActions.innerHTML = ''
                        if(roomStateSnap.val().gameMode === 'standart') {
                            ReactDOM.render(<React.Fragment>
                                <GameAction type="extra-points" valknut={snapshot.val().valknut} runes={snapshot.val().runes} i18n={i18n}/>
                                <GameAction type="extra-points-mobile" valknut={snapshot.val().valknut} runes={snapshot.val().runes} i18n={i18n}/>
                                <GameAction type="damage" valknut={snapshot.val().valknut} i18n={i18n} currentPlayer={snapshot.key}/>
                                <GameAction type="damage-mobile" valknut={snapshot.val().valknut} i18n={i18n} currentPlayer={snapshot.key}/>
                                <GameAction type="extra-turn" valknut={snapshot.val().valknut} turn={snap.val() === cookies.get('key')} i18n={i18n}/>
                                <GameAction type="extra-turn-mobile" valknut={snapshot.val().valknut} turn={snap.val() === cookies.get('key')} i18n={i18n}/>
                            </React.Fragment>, actionButtons)
                        }
                        else {
                            ReactDOM.render(<React.Fragment>
                                <GameAction type="extra-points" valknut={snapshot.val().valknut} runes={snapshot.val().runes} i18n={i18n}/>
                                <GameAction type="extra-points-mobile" valknut={snapshot.val().valknut} runes={snapshot.val().runes} i18n={i18n}/>
                                <GameAction type="damage" valknut={snapshot.val().valknut} i18n={i18n} currentPlayer={snapshot.key}/>
                                <GameAction type="damage-mobile" valknut={snapshot.val().valknut} i18n={i18n} currentPlayer={snapshot.key}/>
                                {snapshot.val().bookLvl >= 1 && <React.Fragment>
                                    <GameAction type="green-dices" valknut={snapshot.val().valknut} i18n={i18n}/>
                                    <GameAction type="green-dices-mobile" valknut={snapshot.val().valknut} i18n={i18n}/>
                                    <GameAction type="clean-state" valknut={snapshot.val().valknut} i18n={i18n}/>
                                    <GameAction type="clean-state-mobile" valknut={snapshot.val().valknut} i18n={i18n}/>
                                </React.Fragment>}
                                {snapshot.val().bookLvl >= 2 && <React.Fragment>
                                    <GameAction type="red-dices" valknut={snapshot.val().valknut} i18n={i18n}/>
                                    <GameAction type="red-dices-mobile" valknut={snapshot.val().valknut} i18n={i18n}/>
                                    <GameAction type="malediction" valknut={snapshot.val().valknut} i18n={i18n} currentPlayer={snapshot.key}/>
                                    <GameAction type="malediction-mobile" valknut={snapshot.val().valknut} i18n={i18n} currentPlayer={snapshot.key}/>
                                </React.Fragment>}
                                {snapshot.val().bookLvl >= 3 && <React.Fragment>
                                    <GameAction type="ghost-dices" valknut={snapshot.val().valknut} i18n={i18n} />
                                    <GameAction type="ghost-dices-mobile" valknut={snapshot.val().valknut} i18n={i18n}/>
                                    <GameAction type="see-dices" valknut={snapshot.val().valknut} i18n={i18n}/>
                                    <GameAction type="see-dices-mobile" valknut={snapshot.val().valknut} i18n={i18n}/>
                                </React.Fragment>}
                                <GameAction type="extra-turn" valknut={snapshot.val().valknut} turn={snap.val() === cookies.get('key')} i18n={i18n}/>
                                <GameAction type="extra-turn-mobile" valknut={snapshot.val().valknut} turn={snap.val() === cookies.get('key')} i18n={i18n}/>
                            </React.Fragment>, actionButtons)
                        }
                        objActions.appendChild(actionButtons)
                    })
                })
                 
                // EVITAR MAL A UN MATEIX AMB DAMAGE
            }
            if (snap.key === 'selectedDices' && document.getElementById('in-game-buttons')) {
                let buttonContainer = document.getElementById('in-game-buttons')
                buttonContainer.innerHTML=''
                let gameStatsRef = firebase.database().ref("Room/Game/Stats")
                gameStatsRef.once("value", function(snapshot) {
                    if(snapshot.val().turn === cookies.get('key')) {
                        const button = document.createElement('div')
                        if (snapshot.val().giveup) {
                            ReactDOM.render(<Button text={i18n('game.giveUp').toUpperCase()} func={giveUp}/>, button)
                        }
                        else {
                            let rollState = snap.val() < 3
                            ReactDOM.render(<Button text={i18n('game.roll').toUpperCase()} func={rollDices} disabled={rollState}/>, button)
                        }
                        buttonContainer.appendChild(button)
                    }
                })
            }
            if (snap.key === 'dead') {
                if (snap.val()) {
                    let currentPlayerTurn = firebase.database().ref("Room/Game/Stats/turn")
                    currentPlayerTurn.once("value", function(snapshot) {
                        let commonView = document.getElementById('common-view')
                        commonView.className = 'hidden'
                        let userView = document.getElementById('user-view')
                        let deadView
                        if (document.getElementById('dead-player')) {
                            deadView = document.getElementById('dead-player')
                            deadView.innerHTML = ''
                        }
                        else {
                            deadView = document.createElement('div')
                            deadView.id = "dead-player"
                        }
                        deadView.className = "flex-div"
                        if (snapshot.val() === cookies.get('key')) {
                            ReactDOM.render(<PlayerDeadView i18n={i18n}/>, deadView) 
                        } else {
                            ReactDOM.render(<Skull/>, deadView) 
                        }
                        userView.appendChild(deadView)
                    })                    
                } else {
                    let deadPlayer = document.getElementById('dead-player')
                    if (deadPlayer) {
                        deadPlayer.remove()
                    }
                    let commonView = document.getElementById('common-view')
                    commonView.className = ''
                }
            }
            if (snap.key === 'winModeStartPlayer') {
                if (snap.val()) {
                    let currentPlayer = firebase.database().ref("Room/Players/"+snap.val() )
                    currentPlayer.once("value", function(snapshot) {
                        let playerName = snapshot.val().username
                        let finalText = i18n('toast.final1') + playerName + i18n('toast.final2')
                        toast(finalText)
                    })
                }
            }
            if (snap.key === 'winner') {
                let winText = i18n('toast.win1')+snap.val().username+ i18n('toast.win2') +snap.val().runes+ i18n('toast.win3')
                toast(winText)
            }
        }
        if (snap.key === 'playing') {
            if (window.location.pathname === '/room' && snap.val()) {
                window.location.href = '/game'
            } else if (window.location.pathname === '/game' && !snap.val()) {
                window.location.href = '/room'
            }
        }
    })
    dbRefGameStats.on('child_changed', snap => {
        if(window.location.pathname === '/game') {
            if (snap.key === 'orderPlayers') {
                let objPlayers = document.getElementById('players')
                let arrayPlayers = snap.val()
                Object.keys(arrayPlayers).forEach(element => {
                    let playerChanged = document.getElementById(arrayPlayers[element])
                    const user = document.createElement('div')
                    user.id=arrayPlayers[element]
                    user.className="c-roomPlayer__container"
                    let currentPlayerStats = firebase.database().ref("Room/Players/"+arrayPlayers[element] )
                    currentPlayerStats.once("value", function(snapshot) {
                        let currentGameMode = firebase.database().ref("Room/RoomState")
                        currentGameMode.once("value", function(gameModeSnap) {
                            let dbGameStats = firebase.database().ref("Room/Game/Stats")
                            dbGameStats.once("value", function(gameStatsSnap) {
                                let gamePlayerData = {
                                    userName: snapshot.val().username,
                                    userTurn: arrayPlayers[0] === snapshot.key,
                                    imageUrl: snapshot.val().imageUrl,
                                    runes: snapshot.val().runes,
                                    lives: snapshot.val().lives,
                                    valknut: snapshot.val().valknut,
                                    helmet: snapshot.val().helmet,
                                    helmetUsed: snapshot.val().helmetUsed,
                                    shield: snapshot.val().shield,
                                    shieldUsed: snapshot.val().shieldUsed,
                                    gameMode: gameModeSnap.val().gameMode,
                                    extraTurn: gameStatsSnap.val().extraTurn,
                                    state: snapshot.val().state,
                                    bookLvl: snapshot.val().bookLvl,
                                    malediction: snapshot.val().malediction,
                                }
                                ReactDOM.render(<GamePlayer i18n={i18n} gamePlayerData={gamePlayerData}/>, user)
                            })
                        })
                    if (playerChanged){
                        playerChanged.remove()
                    }
                    objPlayers.appendChild(user)
                    })
                });
            }
            if (snap.key === 'partialRunes' && document.getElementById('partial-runes')) {
                document.getElementById('partial-runes').innerText = snap.val()
            }
            if(snap.key === 'extraTurn') {
                let currentGStats = firebase.database().ref("Room/Game/Stats" )
                currentGStats.once("value", function(gameSnap) {
                    let objPlayers = document.getElementById('players')
                    let arrayPlayers = gameSnap.val().orderPlayers
                    Object.keys(arrayPlayers).forEach(element => {
                        let playerChanged = document.getElementById(arrayPlayers[element])
                        const user = document.createElement('div')
                        user.id=arrayPlayers[element]
                        user.className="c-roomPlayer__container"
                        objPlayers.appendChild(user)
                        let currentPlayerStats = firebase.database().ref("Room/Players/"+arrayPlayers[element] )
                        currentPlayerStats.once("value", function(snapshot) {
                            let currentGameMode = firebase.database().ref("Room/RoomState")
                                currentGameMode.once("value", function(gameModeSnap) {
                                    let gamePlayerData = {
                                        userName: snapshot.val().username,
                                        userTurn: gameSnap.val().turn === snapshot.key,
                                        imageUrl: snapshot.val().imageUrl,
                                        runes: snapshot.val().runes,
                                        lives: snapshot.val().lives,
                                        valknut: snapshot.val().valknut,
                                        helmet: snapshot.val().helmet,
                                        helmetUsed: snapshot.val().helmetUsed,
                                        shield: snapshot.val().shield,
                                        shieldUsed: snapshot.val().shieldUsed,
                                        gameMode: gameModeSnap.val().gameMode,
                                        extraTurn: gameSnap.val().extraTurn,
                                        state: snapshot.val().state,
                                        bookLvl: snapshot.val().bookLvl,
                                        malediction: snapshot.val().malediction,
                                    }
                                    ReactDOM.render(<GamePlayer i18n={i18n} gamePlayerData={gamePlayerData}/>, user)
                                })
                                if (playerChanged){
                                    objPlayers.replaceChild(user, playerChanged)
                                }
                        })
                    })
                })
            }
            if (snap.key === 'turn' && document.getElementById('selected-dices')) {
                let objSelectedDices = document.getElementById('selected-dices')
                let diceChilds = [...objSelectedDices.children]
                diceChilds.forEach(element => {
                    element.remove()
                })
                let currentGStats = firebase.database().ref("Room/Game/Stats" )
                currentGStats.once("value", function(gameSnap) {
                    let objPlayers = document.getElementById('players')
                    let arrayPlayers = gameSnap.val().orderPlayers
                    Object.keys(arrayPlayers).forEach(element => {
                        let playerChanged = document.getElementById(arrayPlayers[element])
                        const user = document.createElement('div')
                        user.id=arrayPlayers[element]
                        user.className="c-roomPlayer__container"
                        objPlayers.appendChild(user)
                        let currentPlayerStats = firebase.database().ref("Room/Players/"+arrayPlayers[element] )
                        currentPlayerStats.once("value", function(snapshot) {
                            if (snapshot.val()) {
                                let currentGameMode = firebase.database().ref("Room/RoomState")
                                currentGameMode.once("value", function(gameModeSnap) {
                                    let gamePlayerData = {
                                        userName: snapshot.val().username,
                                        userTurn: snap.val() === snapshot.key,
                                        imageUrl: snapshot.val().imageUrl,
                                        runes: snapshot.val().runes,
                                        lives: snapshot.val().lives,
                                        valknut: snapshot.val().valknut,
                                        helmet: snapshot.val().helmet,
                                        helmetUsed: snapshot.val().helmetUsed,
                                        shield: snapshot.val().shield,
                                        shieldUsed: snapshot.val().shieldUsed,
                                        gameMode: gameModeSnap.val().gameMode,
                                        extraTurn: gameSnap.val().extraTurn,
                                        state: snapshot.val().state,
                                        bookLvl: snapshot.val().bookLvl,
                                        malediction: snapshot.val().malediction,
                                    }
                                    ReactDOM.render(<GamePlayer i18n={i18n} gamePlayerData={gamePlayerData}/>, user)
                                })
                                if (playerChanged){
                                    objPlayers.replaceChild(user, playerChanged)
                                }
                            }
                        })
                    })
                })
                let currentPlayerTurn = firebase.database().ref("Room/Players/"+snap.val() )
                currentPlayerTurn.once("value", function(snapshot) {
                    if(snapshot.val()){
                        document.getElementById('turn-title').innerText = snapshot.val().username
                    }
                })
                let buttonContainer = document.getElementById('in-game-buttons')
                buttonContainer.innerHTML=''
                if (snap.val() === cookies.get('key')) {
                    const button = document.createElement('div')
                    ReactDOM.render(<Button text={i18n('game.giveUp').toUpperCase()} func={giveUp}/>, button)
                    buttonContainer.appendChild(button)
                }
                let objActions = document.getElementById('actions-container')
                const actionButtons = document.createElement('div')
                actionButtons.id = 'action-buttons'
                actionButtons.className = "c-game__actions--container"
                let currentPlayerStats = firebase.database().ref("Room/Players/"+cookies.get('key'))
                let defgameMode = firebase.database().ref("Room/RoomState")
                defgameMode.once("value", function(roomStateSnap) {
                    currentPlayerStats.once("value", function(snapshot) {
                        objActions.innerHTML = ''
                        if(roomStateSnap.val().gameMode === 'standart') {
                            ReactDOM.render(<React.Fragment>
                                <GameAction type="extra-points" valknut={snapshot.val().valknut} runes={snapshot.val().runes} i18n={i18n}/>
                                <GameAction type="extra-points-mobile" valknut={snapshot.val().valknut} runes={snapshot.val().runes} i18n={i18n}/>
                                <GameAction type="damage" valknut={snapshot.val().valknut} i18n={i18n} currentPlayer={snapshot.key} />
                                <GameAction type="damage-mobile" valknut={snapshot.val().valknut} i18n={i18n} currentPlayer={snapshot.key}/>
                                <GameAction type="extra-turn" valknut={snapshot.val().valknut} turn={snap.val() === cookies.get('key')} i18n={i18n}/>
                                <GameAction type="extra-turn-mobile" valknut={snapshot.val().valknut} turn={snap.val() === cookies.get('key')} i18n={i18n}/>
                            </React.Fragment>, actionButtons)
                        } else {
                            ReactDOM.render(<React.Fragment>
                                <GameAction type="extra-points" valknut={snapshot.val().valknut} runes={snapshot.val().runes} i18n={i18n}/>
                                <GameAction type="extra-points-mobile" valknut={snapshot.val().valknut} runes={snapshot.val().runes} i18n={i18n}/>
                                <GameAction type="damage" valknut={snapshot.val().valknut} i18n={i18n} currentPlayer={snapshot.key} />
                                <GameAction type="damage-mobile" valknut={snapshot.val().valknut} i18n={i18n} currentPlayer={snapshot.key}/>
                                {snapshot.val().bookLvl >= 1 && <React.Fragment>
                                    <GameAction type="green-dices" valknut={snapshot.val().valknut} i18n={i18n}/>
                                    <GameAction type="green-dices-mobile" valknut={snapshot.val().valknut} i18n={i18n}/>
                                    <GameAction type="clean-state" valknut={snapshot.val().valknut} i18n={i18n}/>
                                    <GameAction type="clean-state-mobile" valknut={snapshot.val().valknut} i18n={i18n}/>
                                </React.Fragment>}
                                {snapshot.val().bookLvl >= 2 && <React.Fragment>
                                    <GameAction type="red-dices" valknut={snapshot.val().valknut} i18n={i18n}/>
                                    <GameAction type="red-dices-mobile" valknut={snapshot.val().valknut} i18n={i18n}/>
                                    <GameAction type="malediction" valknut={snapshot.val().valknut} i18n={i18n} currentPlayer={snapshot.key}/>
                                    <GameAction type="malediction-mobile" valknut={snapshot.val().valknut} i18n={i18n} currentPlayer={snapshot.key}/>
                                </React.Fragment>}
                                {snapshot.val().bookLvl >= 3 && <React.Fragment>
                                    <GameAction type="ghost-dices" valknut={snapshot.val().valknut} i18n={i18n}/>
                                    <GameAction type="ghost-dices-mobile" valknut={snapshot.val().valknut} i18n={i18n}/>
                                    <GameAction type="see-dices" valknut={snapshot.val().valknut} i18n={i18n}/>
                                    <GameAction type="see-dices-mobile" valknut={snapshot.val().valknut} i18n={i18n}/>
                                </React.Fragment>}
                                <GameAction type="extra-turn" valknut={snapshot.val().valknut} turn={snap.val() === cookies.get('key')} i18n={i18n}/>
                                <GameAction type="extra-turn-mobile" valknut={snapshot.val().valknut} turn={snap.val() === cookies.get('key')} i18n={i18n}/>
                            </React.Fragment>, actionButtons)
                        }
                        objActions.appendChild(actionButtons)
                    })
                })
            }
            if (snap.key === 'selectedDices' && document.getElementById('in-game-buttons')) {
                let buttonContainer = document.getElementById('in-game-buttons')
                buttonContainer.innerHTML=''
                let gameStatsRef = firebase.database().ref("Room/Game/Stats")
                gameStatsRef.once("value", function(snapshot) {
                    if(snapshot.val().turn === cookies.get('key')) {
                        const button = document.createElement('div')
                        if (snapshot.val().giveup) {
                            ReactDOM.render(<Button text={i18n('game.giveUp').toUpperCase()} func={giveUp}/>, button)
                        }
                        else {
                            let rollState = snap.val() < 3
                            ReactDOM.render(<Button text={i18n('game.roll').toUpperCase()} func={rollDices} disabled={rollState}/>, button)
                        }
                        buttonContainer.appendChild(button)
                    }
                })
            }
            if (snap.key === 'dead') {
                if (snap.val()) {
                    let currentPlayerTurn = firebase.database().ref("Room/Game/Stats/turn")
                    currentPlayerTurn.once("value", function(snapshot) {
                        let commonView = document.getElementById('common-view')
                        commonView.className = 'hidden'
                        let userView = document.getElementById('user-view')
                        const deadView = document.createElement('div')
                        deadView.id = "dead-player"
                        deadView.className = "flex-div"
                        if (snapshot.val() === cookies.get('key')) {
                            ReactDOM.render(<PlayerDeadView i18n={i18n}/>, deadView) 
                        } else {
                            ReactDOM.render(<Skull/>, deadView) 
                        }
                        userView.appendChild(deadView)
                    })
                } else {
                    let deadPlayer = document.getElementById('dead-player')
                    if (deadPlayer) {
                        deadPlayer.remove()
                    }
                    let commonView = document.getElementById('common-view')
                    commonView.className = ''
                }
            }
            if (snap.key === 'winModeStartPlayer') {
                if (snap.val()) {
                    let currentPlayer = firebase.database().ref("Room/Players/"+snap.val() )
                    currentPlayer.once("value", function(snapshot) {
                        let playerName = snapshot.val().username
                        let finalText = i18n('toast.final1') + playerName + i18n('toast.final2')
                        toast(finalText)
                    })
                }
            }
            if (snap.key === 'winner') {
                let winText = i18n('toast.win1')+snap.val().username+i18n('toast.win2')+snap.val().runes+i18n('toast.win3')
                toast(winText)
            }
        }
        if (snap.key === 'playing') {
            if (window.location.pathname === '/room' && snap.val()) {
                window.location.href = '/game'
            } else if (window.location.pathname === '/game' && !snap.val()) {
                let refGame = firebase.database().ref("Room/Game/")
                let updateGameStats = {}
                updateGameStats['Dices'] = null
                updateGameStats['Stats'] = null
                refGame.update(updateGameStats)
                window.location.href = '/room'
            }
        }
    })

    dbRefGameDices.on('child_added', snap => {
        if(window.location.pathname === '/game') {
            let objDices = document.getElementById('game-dices')
            let diceChanged = document.getElementById(snap.key)
            const dice = document.createElement('div')
            dice.id=snap.key
            ReactDOM.render(<Dice color={snap.val().color} selected={snap.val().selected} value={snap.val().value} i18n={i18n}/>, dice)
            if (diceChanged){
                objDices.replaceChild(dice, diceChanged)
            } else {
                objDices.appendChild(dice)
            }
            if (snap.val().selected && !snap.val().used){
                let objSelectedDices = document.getElementById('selected-dices')
                const diceSelected = document.createElement('div')
                diceSelected.className = snap.val().color
                diceSelected.id=snap.key+"-selected"
                even = !even
                ReactDOM.render(<RollingDice color={snap.val().color} even={even}/>, diceSelected)
                objSelectedDices.appendChild(diceSelected);
                if(snap.val().value === 'ship') {
                    let frontDiceFace = document.getElementById(snap.key+"-selected").getElementsByClassName('data-side-1')
                    let diceValue = document.createElement('div')
                    ReactDOM.render(<Ship/>, diceValue)
                    frontDiceFace[0].appendChild(diceValue);
                }
            }
        }
    })

    dbRefGameDices.on('child_changed', snap => {
        if(window.location.pathname === '/game') {
            let wrapperChanged = document.getElementById(snap.key)
            let objDices = document.getElementById('game-dices')
            const dice = document.createElement('div')
            dice.id=snap.key
            ReactDOM.render(<Dice color={snap.val().color} selected={snap.val().selected} value={snap.val().value} i18n={i18n}/>, dice)
            if (wrapperChanged){
                objDices.replaceChild(dice, wrapperChanged)
            } else {
                objDices.appendChild(dice)
            }
            if (snap.val().used) {
                let diceChanged = document.getElementById(snap.key + "-selected")
                diceChanged && diceChanged.remove()
            }
            if (snap.val().selected && !snap.val().used){
                let objSelectedDices = document.getElementById('selected-dices')
                wrapperChanged = document.getElementById(snap.key+"-selected")
                if (!wrapperChanged){
                    const diceSelected = document.createElement('div')
                    diceSelected.className = snap.val().color
                    diceSelected.id=snap.key+"-selected"
                    even = !even
                    ReactDOM.render(<RollingDice color={snap.val().color} even={even}/>, diceSelected)
                    objSelectedDices.appendChild(diceSelected)
                }
                else {
                    wrapperChanged.className = snap.val().color
                    ReactDOM.render(<RollingDice color={snap.val().color} even={even}/>, wrapperChanged)
                }
                if(snap.val().value && wrapperChanged && snap.val().rolling){
                    
                    let frontDiceFace = wrapperChanged.getElementsByClassName('data-side-1')
                    let diceValue = document.createElement('div')
                    wrapperChanged.children[0].classList.toggle("odd-roll")
                    wrapperChanged.children[0].classList.toggle("even-roll")
                    if(snap.val().value === 'damage') {
                        ReactDOM.render(<Damage/>, diceValue)
                    }
                    else if(snap.val().value === 'ship') {
                        ReactDOM.render(<Ship/>, diceValue)
                    }
                    else if(snap.val().value === 'rune') {
                        ReactDOM.render(<Rune/>, diceValue)
                    }
                    else if(snap.val().value === 'beer') {
                        ReactDOM.render(<Beer/>, diceValue)
                    }
                    else if(snap.val().value === 'helmet') {
                        ReactDOM.render(<Helmet/>, diceValue)
                    }
                    else if(snap.val().value === 'shield') {
                        ReactDOM.render(<Shield/>, diceValue)
                    }
                    else if(snap.val().value === 'horn') {
                        ReactDOM.render(<Horn/>, diceValue)
                    }
                    else if(snap.val().value === 'ham') {
                        ReactDOM.render(<Ham/>, diceValue)
                    }
                    else if(snap.val().value === 'thunder') {
                        ReactDOM.render(<Thunder/>, diceValue)
                    }
                    else if(snap.val().value === 'mushroom') {
                        ReactDOM.render(<Mushroom/>, diceValue)
                    }
                    else if(snap.val().value === 'book') {
                        ReactDOM.render(<Book/>, diceValue)
                    }
                    else if(snap.val().value === 'raven') {
                        ReactDOM.render(<Raven/>, diceValue)
                    }
                    else if(snap.val().value === 'dragon') {
                        ReactDOM.render(<Dragon/>, diceValue)
                    }
                    else if(snap.val().value === 'critical') {
                        ReactDOM.render(<Critical/>, diceValue)
                    }
                    else if(snap.val().value === 'valknut') {
                        ReactDOM.render(<Valknut/>, diceValue)
                    }
                    if(frontDiceFace[0].children[0]){
                        frontDiceFace[0].replaceChild(diceValue, frontDiceFace[0].children[0])
                    } else {
                        frontDiceFace[0].appendChild(diceValue)
                    }
                    
                }
                
            }
        }
    })

    dbRefGameActions.on('child_added', snap => {
        if(window.location.pathname === '/game') {
            let actionText = i18n('toast.act1') + snap.val().user + i18n('toast.act2') + snap.val().message + i18n('toast.act3')
            toast.dark(actionText)
        }
    })

    dbRefPlayers.on('child_added', snap => {
        if (window.location.pathname === '/room'){
            let playerChanged = document.getElementById(snap.key)
            let objPlayers = document.getElementById('players')
            const user = document.createElement('div')
            user.id=snap.key
            user.className="c-roomPlayer__container"
            ReactDOM.render(<RoomPlayer userName={snap.val().username} ready={snap.val().ready} i18n={i18n} imageUrl={snap.val().imageUrl}/>, user)
            if (playerChanged){
                objPlayers.replaceChild(user, playerChanged)
            } else {
                objPlayers.appendChild(user)
            }
            if (snap.key===cookies.get('key')) {
                let buttonReady = document.getElementById('room-ready-btn')
                buttonReady.innerHTML =''
                const buttonContainer = document.createElement('div')
                ReactDOM.render(<Button text={snap.val().ready ? i18n('room.notReady').toUpperCase() : i18n('room.imReady').toUpperCase()} func={toggleReady}/>, buttonContainer)
                buttonReady.appendChild(buttonContainer)
            }
        }
        if (window.location.pathname === '/game'){
            if (snap.key === cookies.get('key')){
                let pChanged = document.getElementById(snap.key + 'valknut')
                if (pChanged) {
                    pChanged.remove()
                }
                let objValknut = document.getElementById('valknut-points')
                const valknutP = document.createElement('span')
                valknutP.id = snap.key + 'valknut'
                valknutP.innerText = snap.val().valknut
                objValknut.appendChild(valknutP)

                let actionsChanged = document.getElementById('action-buttons')
                if (actionsChanged) {
                    actionsChanged.remove()
                }
                let objActions = document.getElementById('actions-container')
                const actionButtons = document.createElement('div')
                actionButtons.id = 'action-buttons'
                actionButtons.className = "c-game__actions--container"
                let currentPlayerTurn = firebase.database().ref("Room/Game/Stats/turn")
                let defgameMode = firebase.database().ref("Room/RoomState")
                defgameMode.once("value", function(roomStateSnap) {
                    currentPlayerTurn.once("value", function(snapshot) {
                        objActions.innerHTML = ''
                        if(roomStateSnap.val().gameMode === 'standart') {
                            ReactDOM.render(<React.Fragment>
                                <GameAction type="extra-points" valknut={snap.val().valknut} runes={snap.val().runes} i18n={i18n}/>
                                <GameAction type="extra-points-mobile" valknut={snap.val().valknut} runes={snap.val().runes} i18n={i18n}/>
                                <GameAction type="damage" valknut={snap.val().valknut} i18n={i18n} currentPlayer={snap.key}/>
                                <GameAction type="damage-mobile" valknut={snap.val().valknut} i18n={i18n} currentPlayer={snap.key}/>
                                <GameAction type="extra-turn" valknut={snap.val().valknut} turn={snapshot.val() === cookies.get('key')} i18n={i18n}/>
                                <GameAction type="extra-turn-mobile" valknut={snap.val().valknut} turn={snapshot.val() === cookies.get('key')} i18n={i18n}/>
                            </React.Fragment>, actionButtons)
                        } else {
                            ReactDOM.render(<React.Fragment>
                                <GameAction type="extra-points" valknut={snap.val().valknut} runes={snap.val().runes} i18n={i18n}/>
                                <GameAction type="extra-points-mobile" valknut={snap.val().valknut} runes={snap.val().runes} i18n={i18n}/>
                                <GameAction type="damage" valknut={snap.val().valknut} i18n={i18n} currentPlayer={snap.key}/>
                                <GameAction type="damage-mobile" valknut={snap.val().valknut} i18n={i18n} currentPlayer={snap.key}/>
                                {snap.val().bookLvl >= 1 && <React.Fragment>
                                    <GameAction type="green-dices" valknut={snap.val().valknut} i18n={i18n}/>
                                    <GameAction type="green-dices-mobile" valknut={snap.val().valknut} i18n={i18n}/>
                                    <GameAction type="clean-state" valknut={snap.val().valknut} i18n={i18n}/>
                                    <GameAction type="clean-state-mobile" valknut={snap.val().valknut} i18n={i18n}/>
                                </React.Fragment>}
                                {snap.val().bookLvl >= 2 && <React.Fragment>
                                    <GameAction type="red-dices" valknut={snap.val().valknut} i18n={i18n}/>
                                    <GameAction type="red-dices-mobile" valknut={snap.val().valknut} i18n={i18n}/>
                                    <GameAction type="malediction" valknut={snap.val().valknut} i18n={i18n} currentPlayer={snap.key}/>
                                    <GameAction type="malediction-mobile" valknut={snap.val().valknut} i18n={i18n} currentPlayer={snap.key}/>
                                </React.Fragment>}
                                {snap.val().bookLvl >= 3 && <React.Fragment>
                                    <GameAction type="ghost-dices" valknut={snap.val().valknut} i18n={i18n}/>
                                    <GameAction type="ghost-dices-mobile" valknut={snap.val().valknut} i18n={i18n}/>
                                    <GameAction type="see-dices" valknut={snap.val().valknut} i18n={i18n}/>
                                    <GameAction type="see-dices-mobile" valknut={snap.val().valknut} i18n={i18n}/>
                                </React.Fragment>}
                                <GameAction type="extra-turn" valknut={snap.val().valknut} turn={snapshot.val() === cookies.get('key')} i18n={i18n}/>
                                <GameAction type="extra-turn-mobile" valknut={snap.val().valknut} turn={snapshot.val() === cookies.get('key')} i18n={i18n}/>
                            </React.Fragment>, actionButtons)
                        }
                        objActions.appendChild(actionButtons)
                    })
                })
            }
            let objPlayers = document.getElementById('players')
            let playerChanged = document.getElementById(snap.key)
            const user = document.createElement('div')
            user.id=snap.key
            user.className="c-roomPlayer__container"
            let currentGameTurn = firebase.database().ref("Room/Game/Stats")
            currentGameTurn.once("value", function(snapshot) {
                let currentGameMode = firebase.database().ref("Room/RoomState")
                currentGameMode.once("value", function(gameModeSnap) {
                    let gamePlayerData = {
                        userName: snap.val().username,
                        userTurn: snapshot.val().turn === snap.key,
                        imageUrl: snap.val().imageUrl,
                        runes: snap.val().runes,
                        lives: snap.val().lives,
                        valknut: snap.val().valknut,
                        helmet: snap.val().helmet,
                        helmetUsed: snap.val().helmetUsed,
                        shield: snap.val().shield,
                        shieldUsed: snap.val().shieldUsed,
                        gameMode: gameModeSnap.val().gameMode,
                        extraTurn: snapshot.val().extraTurn,
                        state: snap.val().state,
                        bookLvl: snap.val().bookLvl,
                        malediction: snap.val().malediction,
                    }
                    ReactDOM.render(<GamePlayer i18n={i18n} gamePlayerData={gamePlayerData}/>, user)
                })
                if (playerChanged){
                    objPlayers.replaceChild(user, playerChanged)
                }
            })
        }   
    })
    dbRefPlayers.on('child_removed', snap => {
        const pRemoved = document.getElementById(snap.key)
        if (pRemoved) pRemoved.remove()
    })

    dbRefPlayers.on('child_changed', snap => {
        if (window.location.pathname === '/room'){
            let playerChanged = document.getElementById(snap.key)
            let objPlayers = document.getElementById('players')
            const user = document.createElement('div')
            user.id = snap.key
            user.className="c-roomPlayer__container"
            ReactDOM.render(<RoomPlayer userName={snap.val().username} ready={snap.val().ready} i18n={i18n} imageUrl={snap.val().imageUrl}/>, user)
            if (playerChanged){
                objPlayers.replaceChild(user, playerChanged)
            } else {
                objPlayers.appendChild(user)
            }
            if (snap.key===cookies.get('key')) {
                let buttonReady = document.getElementById('room-ready-btn')
                buttonReady.innerHTML =''
                const buttonContainer = document.createElement('div')
                ReactDOM.render(<Button text={snap.val().ready ? i18n('room.notReady').toUpperCase() : i18n('room.imReady').toUpperCase()} func={toggleReady}/>, buttonContainer)
                buttonReady.appendChild(buttonContainer)
            }
        }
        if (window.location.pathname === '/game'){
            if (snap.key === cookies.get('key')){
                let pChanged = document.getElementById(snap.key + 'valknut')
                if (pChanged) {
                    pChanged.remove()
                }
                let objValknut = document.getElementById('valknut-points')
                const valknutP = document.createElement('span')
                valknutP.id = snap.key + 'valknut'
                valknutP.innerText = snap.val().valknut
                objValknut.appendChild(valknutP)
                let actionsChanged = document.getElementById('action-buttons')
                if (actionsChanged) {
                    actionsChanged.remove()
                }
                let objActions = document.getElementById('actions-container')
                const actionButtons = document.createElement('div')
                actionButtons.id = 'action-buttons'
                actionButtons.className = "c-game__actions--container"
                let currentPlayerTurn = firebase.database().ref("Room/Game/Stats/turn")
                let defgameMode = firebase.database().ref("Room/RoomState")
                defgameMode.once("value", function(roomStateSnap) {
                    currentPlayerTurn.once("value", function(snapshot) {
                        objActions.innerHTML = ''
                        if(roomStateSnap.val().gameMode === 'standart') {
                            ReactDOM.render(<React.Fragment>
                                <GameAction type="extra-points" valknut={snap.val().valknut} runes={snap.val().runes} i18n={i18n}/>
                                <GameAction type="extra-points-mobile" valknut={snap.val().valknut} runes={snap.val().runes} i18n={i18n}/>
                                <GameAction type="damage" valknut={snap.val().valknut} i18n={i18n} currentPlayer={snap.key}/>
                                <GameAction type="damage-mobile" valknut={snap.val().valknut} i18n={i18n} currentPlayer={snap.key}/>
                                <GameAction type="extra-turn" valknut={snap.val().valknut} turn={snapshot.val() === cookies.get('key')} i18n={i18n}/>
                                <GameAction type="extra-turn-mobile" valknut={snap.val().valknut} turn={snapshot.val() === cookies.get('key')} i18n={i18n}/>
                            </React.Fragment>, actionButtons)
                        } else {
                            ReactDOM.render(<React.Fragment>
                                <GameAction type="extra-points" valknut={snap.val().valknut} runes={snap.val().runes} i18n={i18n}/>
                                <GameAction type="extra-points-mobile" valknut={snap.val().valknut} runes={snap.val().runes} i18n={i18n}/>
                                <GameAction type="damage" valknut={snap.val().valknut} i18n={i18n} currentPlayer={snap.key}/>
                                <GameAction type="damage-mobile" valknut={snap.val().valknut} i18n={i18n} currentPlayer={snap.key}/>
                                {snap.val().bookLvl >= 1 && <React.Fragment>
                                    <GameAction type="green-dices" valknut={snap.val().valknut} i18n={i18n}/>
                                    <GameAction type="green-dices-mobile" valknut={snap.val().valknut} i18n={i18n}/>
                                    <GameAction type="clean-state" valknut={snap.val().valknut} i18n={i18n}/>
                                    <GameAction type="clean-state-mobile" valknut={snap.val().valknut} i18n={i18n}/>
                                </React.Fragment>}
                                {snap.val().bookLvl >= 2 && <React.Fragment>
                                    <GameAction type="red-dices" valknut={snap.val().valknut} i18n={i18n}/>
                                    <GameAction type="red-dices-mobile" valknut={snap.val().valknut} i18n={i18n}/>
                                    <GameAction type="malediction" valknut={snap.val().valknut} i18n={i18n} currentPlayer={snap.key}/>
                                    <GameAction type="malediction-mobile" valknut={snap.val().valknut} i18n={i18n} currentPlayer={snap.key}/>
                                </React.Fragment>}
                                {snap.val().bookLvl >= 3 && <React.Fragment>
                                    <GameAction type="ghost-dices" valknut={snap.val().valknut} i18n={i18n}/>
                                    <GameAction type="ghost-dices-mobile" valknut={snap.val().valknut} i18n={i18n}/>
                                    <GameAction type="see-dices" valknut={snap.val().valknut} i18n={i18n}/>
                                    <GameAction type="see-dices-mobile" valknut={snap.val().valknut} i18n={i18n}/>
                                </React.Fragment>}
                                <GameAction type="extra-turn" valknut={snap.val().valknut} turn={snapshot.val() === cookies.get('key')} i18n={i18n}/>
                                <GameAction type="extra-turn-mobile" valknut={snap.val().valknut} turn={snapshot.val() === cookies.get('key')} i18n={i18n}/>
                            </React.Fragment>, actionButtons)
                        }
                        objActions.appendChild(actionButtons)
                    })
                })
            }
            let objPlayers = document.getElementById('players')
            let playerChanged = document.getElementById(snap.key)
            const user = document.createElement('div')
            user.id=snap.key
            user.className="c-roomPlayer__container"
            let currentGameTurn = firebase.database().ref("Room/Game/Stats")
            currentGameTurn.once("value", function(snapshot) {
                let currentGameMode = firebase.database().ref("Room/RoomState")
                currentGameMode.once("value", function(gameModeSnap) {
                    let gamePlayerData = {
                        userName: snap.val().username,
                        userTurn: snapshot.val().turn === snap.key,
                        imageUrl: snap.val().imageUrl,
                        runes: snap.val().runes,
                        lives: snap.val().lives,
                        valknut: snap.val().valknut,
                        helmet: snap.val().helmet,
                        helmetUsed: snap.val().helmetUsed,
                        shield: snap.val().shield,
                        shieldUsed: snap.val().shieldUsed,
                        gameMode: gameModeSnap.val().gameMode,
                        extraTurn: snapshot.val().extraTurn,
                        state: snap.val().state,
                        bookLvl: snap.val().bookLvl,
                        malediction: snap.val().malediction,
                    }
                    ReactDOM.render(<GamePlayer i18n={i18n} gamePlayerData={gamePlayerData}/>, user)
                })
                if (playerChanged){
                    objPlayers.replaceChild(user, playerChanged)
                }

                if (snapshot.val() === snap.key) {
                    document.getElementById('turn-title').innerText = snap.val().username
                }
            })
        }
    })

    dbRefChat.on('child_added', snap => {
        if (window.location.pathname === '/room' || window.location.pathname === '/game'){
            let pChanged = document.getElementById(snap.key)
            if (pChanged) {
                pChanged.remove()
            }
            const user = document.createElement('p')
            user.innerText = snap.val().username + ': '
            user.id = snap.key
            const message = document.createElement('span')
            message.innerText = snap.val().message
            user.appendChild(message)
            let objChat = document.getElementById('chat')
            objChat.appendChild(user)
            objChat.scrollTop = objChat.scrollHeight
        }
    })

    dbRefChat.on('child_changed', snap => {
        if (window.location.pathname === '/room' || window.location.pathname === '/game'){
            let pChanged = document.getElementById(snap.key)
            if (pChanged) {
                pChanged.remove()
            }
            const user = document.createElement('p')
            user.innerText = snap.val().username + ': '
            user.id = snap.key
            const message = document.createElement('span')
            message.innerText = snap.val().message
            user.appendChild(message)
            let objChat = document.getElementById('chat')
            objChat.appendChild(user)
            objChat.scrollTop = objChat.scrollHeight
        }
    })

    dbRefChat.on('child_removed', snap => {
        const pRemoved = document.getElementById(snap.key)
        pRemoved.remove()
    })

    dbRefGameMode.on('child_added', snap => {
        if (window.location.pathname === '/room') {
            let gameModeButton = document.getElementById('game-mode-button')
            gameModeButton.innerText = snap.val().toUpperCase()
        }
        else if (window.location.pathname === '/game') {
            document.getElementById('game-mode-title').innerText = snap.val()
        }
    })

    dbRefGameMode.on('child_changed', snap => {
        if (window.location.pathname === '/room') {
            let gameModeButton = document.getElementById('game-mode-button')
            gameModeButton.innerText = snap.val().toUpperCase()
        }
    })
}

