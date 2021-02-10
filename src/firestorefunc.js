import firebase from 'firebase'
import RoomPlayer from './components/RoomPlayer';
import ReactDOM from 'react-dom'

let db

export function initFirebase() {
    db = firebase.firestore();
    let dbRefPlayers = firebase.database().ref().child('Room').child('Players')
    let dbRefChat = firebase.database().ref().child('Room').child('Chat')

    // db functions working
    dbRefPlayers.on('child_added', snap => {
        if (window.location.pathname !== '/'){
            let objPlayers = document.getElementById('players')
            const user = document.createElement('div')
            user.id=snap.key
            ReactDOM.render(<RoomPlayer userName={snap.val().username} ready={snap.val().ready} imageUrl={snap.val().imageUrl}/>, user)
            objPlayers.appendChild(user);
        }
    })
    dbRefPlayers.on('child_removed', snap => {
        const pRemoved = document.getElementById(snap.key)
        pRemoved.remove()
    })

    dbRefPlayers.on('child_changed', snap => {
        let pChanged = document.getElementById(snap.key)
        pChanged.remove()
        let objPlayers = document.getElementById('players')
        const user = document.createElement('div')
        user.id = snap.key
        ReactDOM.render(<RoomPlayer userName={snap.val().username} ready={snap.val().ready} imageUrl={snap.val().imageUrl}/>, user)
        objPlayers.appendChild(user)
    })

    dbRefChat.on('child_added', snap => {
        if (window.location.pathname !== '/'){
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

