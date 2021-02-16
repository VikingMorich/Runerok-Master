import firebase from 'firebase'
import React from 'react';
import RoomPlayer from './components/RoomPlayer';
import GamePlayer from './components/GamePlayer';
import GameAction from './components/GameAction';
import ReactDOM from 'react-dom'
import Cookies from 'universal-cookie';

let db

export function initFirebase(i18n) {
    db = firebase.firestore();
    let cookies = new Cookies();
    let dbRefPlayers = firebase.database().ref().child('Room').child('Players')
    let dbRefChat = firebase.database().ref().child('Room').child('Chat')

    // db functions working
    dbRefPlayers.on('child_added', snap => {
        if (window.location.pathname === '/room' || window.location.pathname === '/game'){
            let pChanged = document.getElementById(snap.key)
            if (pChanged) {
                pChanged.remove()
            }
            let objPlayers = document.getElementById('players')
            const user = document.createElement('div')
            user.id=snap.key
            user.className="c-roomPlayer__container"
            if (window.location.pathname === '/room'){
                ReactDOM.render(<RoomPlayer userName={snap.val().username} ready={snap.val().ready} i18n={i18n} imageUrl={snap.val().imageUrl}/>, user)
            }
            if (window.location.pathname === '/game'){
                ReactDOM.render(<GamePlayer userName={snap.val().username} userTurn={snap.val().userTurn} imageUrl={snap.val().imageUrl} runes={snap.val().runes} lives={snap.val().lives} valknut={snap.val().valknut}/>, user)  
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
            }
            objPlayers.appendChild(user);
        }
    })
    dbRefPlayers.on('child_removed', snap => {
        const pRemoved = document.getElementById(snap.key)
        pRemoved.remove()
    })

    dbRefPlayers.on('child_changed', snap => {
        if (window.location.pathname === '/room' || window.location.pathname === '/game'){
            let pChanged = document.getElementById(snap.key)
                pChanged.remove()
                let objPlayers = document.getElementById('players')
                const user = document.createElement('div')
                user.id = snap.key
                user.className="c-roomPlayer__container"
            if (window.location.pathname === '/room'){
                ReactDOM.render(<RoomPlayer userName={snap.val().username} ready={snap.val().ready} i18n={i18n} imageUrl={snap.val().imageUrl}/>, user)
            }
            if (window.location.pathname === '/game'){
                ReactDOM.render(<GamePlayer userName={snap.val().username} userTurn={snap.val().userTurn} imageUrl={snap.val().imageUrl} runes={snap.val().runes} lives={snap.val().lives} valknut={snap.val().valknut}/>, user)  
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
            }
            objPlayers.appendChild(user);
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

