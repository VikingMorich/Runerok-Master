import firebase from 'firebase'
import React from 'react';
import RoomPlayer from './components/RoomPlayer';
import GamePlayer from './components/GamePlayer';
import GameAction from './components/GameAction';
import PlayerDeadView from './components/PlayerDeadView';
import { Dice } from './components/dice/dice';
import ReactDOM from 'react-dom'
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import Button from './components/Button';
import { rollDices, giveUp } from './components/GameFunctions'

export function initFirebase(i18n) {
    let cookies = new Cookies();
    let dbRefPlayers = firebase.database().ref().child('Room').child('Players')
    let dbRefChat = firebase.database().ref().child('Room').child('Chat')
    let dbRefGameActions = firebase.database().ref().child('Room').child('Game').child('Actions')
    let dbRefGameDices = firebase.database().ref().child('Room').child('Game').child('Dices')
    let dbRefGameStats = firebase.database().ref().child('Room').child('Game').child('Stats')

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
                        ReactDOM.render(<GamePlayer userName={snapshot.val().username} userTurn={arrayPlayers[0] === snapshot.key} imageUrl={snapshot.val().imageUrl} runes={snapshot.val().runes} lives={snapshot.val().lives} valknut={snapshot.val().valknut}/>, user) 
                        if (playerChanged){
                            objPlayers.replaceChild(user, playerChanged)
                        }
                    })
                })
                
            }
            // let buttonContainer = document.getElementById('in-game-buttons')
            // const button = document.createElement('div')
            // if (snap.val() && snap.key === 'giveup') {         
            //     ReactDOM.render(<Button text={'game.giveUp'} func={() => {}}/>, button)
                
            // } else if (!snap.val() && snap.key === 'giveup') {
            //     ReactDOM.render(<Button text={'game.roll'} func={() => {}}/>, button)
            // } else 
            if (snap.key === 'partialRunes') {
                document.getElementById('partial-runes').innerText = snap.val()
            }
            if (snap.key === 'turn') {
                let currentPlayerTurn = firebase.database().ref("Room/Players/"+snap.val() )
                currentPlayerTurn.once("value", function(snapshot) {
                    document.getElementById('turn-title').innerText = snapshot.val().username
                })
            }
            if (snap.key === 'selectedDices') {
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
                        if (snapshot.val() === cookies.get('key')) {
                            let commonView = document.getElementById('common-view')
                            commonView.className = 'hidden'
                            let userView = document.getElementById('user-view')
                            const deadView = document.createElement('div')
                            deadView.id = "dead-player"
                            deadView.className = "flex-div"
                            ReactDOM.render(<PlayerDeadView i18n={i18n}/>, deadView) 
                            userView.appendChild(deadView)
                        } else {
                            let deadPlayer = document.getElementById('dead-player')
                            if (deadPlayer) {
                                deadPlayer.remove()
                            }
                            let commonView = document.getElementById('common-view')
                            commonView.className = ''
                        }
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
                        let actionText = "🎊 RONDA FINAL 🎊\n\n🏅" + playerName + " ha conseguit impresionar als deus🏅"
                        toast(actionText)
                    })
                }
            }
            if (snap.key === 'winner') {
                let winText = '🎴 GAME OVER 🎴\n\n🏆 The winner is '+snap.val().username+' with '+snap.val().runes+' runes 🔥\n\nValhalleluja'
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
                        ReactDOM.render(<GamePlayer userName={snapshot.val().username} userTurn={arrayPlayers[0] === snapshot.key} imageUrl={snapshot.val().imageUrl} runes={snapshot.val().runes} lives={snapshot.val().lives} valknut={snapshot.val().valknut}/>, user) 
                    if (playerChanged){
                        playerChanged.remove()
                    }
                    objPlayers.appendChild(user)
                    })
                });
            }
            if (snap.key === 'partialRunes') {
                document.getElementById('partial-runes').innerText = snap.val()
            }
            if (snap.key === 'turn') {
                let currentPlayerTurn = firebase.database().ref("Room/Players/"+snap.val() )
                currentPlayerTurn.once("value", function(snapshot) {
                    document.getElementById('turn-title').innerText = snapshot.val().username
                })
                let buttonContainer = document.getElementById('in-game-buttons')
                if (snap.val() !== cookies.get('key')) {
                    buttonContainer.innerHTML=''
                } else {
                    const button = document.createElement('div')
                    ReactDOM.render(<Button text={i18n('game.giveUp').toUpperCase()} func={giveUp}/>, button)
                    buttonContainer.appendChild(button)
                }
            }
            if (snap.key === 'selectedDices') {
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
                        if (snapshot.val() === cookies.get('key')) {
                            let commonView = document.getElementById('common-view')
                            commonView.className = 'hidden'
                            let userView = document.getElementById('user-view')
                            const deadView = document.createElement('div')
                            deadView.id = "dead-player"
                            deadView.className = "flex-div"
                            ReactDOM.render(<PlayerDeadView i18n={i18n}/>, deadView) 
                            userView.appendChild(deadView)
                        } else {
                            let deadPlayer = document.getElementById('dead-player')
                            if (deadPlayer) {
                                deadPlayer.remove()
                            }
                            let commonView = document.getElementById('common-view')
                            commonView.className = ''
                        }
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
                        let actionText = "🎊 RONDA FINAL 🎊\n\n🏅" + playerName + " ha conseguit impresionar als deus🏅"
                        toast(actionText)
                    })
                }
            }
            if (snap.key === 'winner') {
                let winText = '🎴 GAME OVER 🎴\n\n🏆 The winner is '+snap.val().username+' with '+snap.val().runes+' runes 🔥\n\nValhalleluja'
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

    dbRefGameDices.on('child_added', snap => {
        if(window.location.pathname === '/game') {
            let objDices = document.getElementById('game-dices')
            const dice = document.createElement('div')
            dice.id=snap.key
            ReactDOM.render(<Dice color={snap.val().color} selected={snap.val().selected} value={snap.val().value}/>, dice)
            objDices.appendChild(dice);
            if (snap.val().selected && !snap.val().used){
                let objSelectedDices = document.getElementById('selected-dices')
                const diceSelected = document.createElement('div')
                ReactDOM.render(<Dice color={snap.val().color} selected={snap.val().selected} value={snap.val().value}/>, diceSelected)
                diceSelected.id=snap.key+"-selected"
                diceSelected.className = snap.val().color
                objSelectedDices.appendChild(diceSelected);
            }
        }
    })

    dbRefGameDices.on('child_changed', snap => {
        if(window.location.pathname === '/game') {
            let wrapperChanged = document.getElementById(snap.key)
            let objDices = document.getElementById('game-dices')
            const dice = document.createElement('div')
            dice.id=snap.key
            ReactDOM.render(<Dice color={snap.val().color} selected={snap.val().selected} value={snap.val().value}/>, dice)
            objDices.replaceChild(dice, wrapperChanged);
            let diceChanged = document.getElementById(snap.key + "-selected")
            if (diceChanged) {
                diceChanged.remove()
            }
            if (snap.val().selected && !snap.val().used){
                let objSelectedDices = document.getElementById('selected-dices')
                const diceSelected = document.createElement('div')
                ReactDOM.render(<Dice color={snap.val().color} selected={snap.val().selected} value={snap.val().value}/>, diceSelected)
                diceSelected.id=snap.key+"-selected"
                diceSelected.className = snap.val().color
                objSelectedDices.appendChild(diceSelected);
            }
        }
    })

    dbRefGameActions.on('child_added', snap => {
        if(window.location.pathname === '/game') {
            let actionText = "⚠️ ACCIÓ JUGADA ⚠️\n\n🧙🏻‍♂️ Player: " + snap.val().user + "\n🔮 Action: " + snap.val().message +' ✨'
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
                ReactDOM.render(<React.Fragment>
                    <GameAction type="extra-points" valknut={snap.val().valknut} runes={snap.val().runes} i18n={i18n}/>
                    <GameAction type="damage" valknut={snap.val().valknut} runes={snap.val().runes} i18n={i18n}/>
                    </React.Fragment>, actionButtons)
                objActions.appendChild(actionButtons)
            }
            let objPlayers = document.getElementById('players')
            let playerChanged = document.getElementById(snap.key)
            const user = document.createElement('div')
            user.id=snap.key
            user.className="c-roomPlayer__container"
            let currentGameTurn = firebase.database().ref("Room/Game/Stats/turn")
            currentGameTurn.once("value", function(snapshot) {
                ReactDOM.render(<GamePlayer userName={snap.val().username} userTurn={snapshot.val() === snap.key} imageUrl={snap.val().imageUrl} runes={snap.val().runes} lives={snap.val().lives} valknut={snap.val().valknut}/>, user) 
                if (playerChanged){
                    objPlayers.replaceChild(user, playerChanged)
                }
            })
        }            
    })
    dbRefPlayers.on('child_removed', snap => {
        const pRemoved = document.getElementById(snap.key)
        pRemoved.remove()
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
                ReactDOM.render(<React.Fragment>
                    <GameAction type="extra-points" valknut={snap.val().valknut} runes={snap.val().runes} i18n={i18n}/>
                    <GameAction type="damage" valknut={snap.val().valknut} runes={snap.val().runes} i18n={i18n}/>
                    </React.Fragment>, actionButtons)
                objActions.appendChild(actionButtons)
            }
            let objPlayers = document.getElementById('players')
            let playerChanged = document.getElementById(snap.key)
            const user = document.createElement('div')
            user.id=snap.key
            user.className="c-roomPlayer__container"
            let currentGameTurn = firebase.database().ref("Room/Game/Stats/turn")
            currentGameTurn.once("value", function(snapshot) {
                ReactDOM.render(<GamePlayer userName={snap.val().username} userTurn={snapshot.val() === snap.key} imageUrl={snap.val().imageUrl} runes={snap.val().runes} lives={snap.val().lives} valknut={snap.val().valknut}/>, user) 
                if (playerChanged){
                    objPlayers.replaceChild(user, playerChanged)
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
}

