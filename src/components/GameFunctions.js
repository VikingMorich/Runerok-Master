import fire from '../fire'
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';

let cookies = new Cookies();
  
const diceTypes = {
    "green": ["rune", "rune", "rune", "ship", "valknut", "damage"],
    "yellow": ["rune", "rune", "ship", "valknut", "damage", "damage"],
    "red": ["rune", "valknut", "ship", "damage", "damage", "damage"],
    "blue": ['shield', 'helmet', 'damage', 'damage', 'valknut', 'ship'],
    "purple": ['horn', 'ham', 'beer', 'damage', 'critical', 'critical'],
    //"blue": ['beer', 'beer', 'beer', 'beer', 'beer', 'beer'],

    
    /** Helmet = +1 armor helm
    * Shield = +1 armor shield
    * Horn = +1 punt directe pel final
    * Beer= inmunity to take damage this turn
    * Ham= +1 live
    * Critical = -2 live
    */
}
const diceNumberStandart = {
    "green": 11,
    "yellow": 9,
    "red": 7,
}

const diceNumberHardcore = {
    "green": 1,
    "blue": 10,
    "purple": 10,
    // "green": 9,
    // "yellow": 7,
    // "red": 7,
    // "blue": 1,
    // "purple": 3, 
}

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

const getRandomDicePosition = () => {
    let arrayDices = []
    let refGameMode = fire.database().ref("Room/RoomState/gameMode")
    //standart, hardcore
    refGameMode.once("value", function(gameModeSnap) {
        if (gameModeSnap.val() === 'standart') {
            Object.keys(diceNumberStandart).forEach(element => {
                for (let i = 0; i < diceNumberStandart[element]; i++) {
                    arrayDices.push(element)
                }
            });
        }
        else if (gameModeSnap.val() === 'hardcore') {
            Object.keys(diceNumberHardcore).forEach(element => {
                for (let i = 0; i < diceNumberHardcore[element]; i++) {
                    arrayDices.push(element)
                }
            });
        }
    })
    arrayDices = arrayDices.sort(function() {return Math.random() - 0.5})
    return arrayDices
}

export const confirmExitGame = (text) => {
    let confirmation = window.confirm(text)
    if (confirmation) {
        exitGame()
    }
}

const exitGame = () => {
    let refStats = fire.database().ref("Room/Game/Stats")
    let updateStats = {}
    updateStats['playing'] = false
    refStats.update(updateStats)
}

export const rollDices = () => {
    let dices = document.getElementById('selected-dices').childNodes
    let shipCount = 0
    const numberDices = dices.length
    let instanceDices =  { ...dices }
    let arrayValues = []
    let currentGameState = fire.database().ref("Room/Game/Stats")
    let giveUpState = {}
        for (let i = 0; i < numberDices; i++) {
            let str = instanceDices[i].id
            let res = str.replace("-selected", "");
            let ref = fire.database().ref("Room/Game/Dices/" + res)
            let updates = {}
            
            let randVal = getRandomInt(6)
            let color = instanceDices[i].className
            let value = diceTypes[color][randVal]
            if (value === 'ship') {
                shipCount += 1
            }
            updates['value'] = value
            updates['rolling'] = true
            arrayValues.push(value)
            ref.update(updates)
        }
        giveUpState['giveup'] = true
        giveUpState['selectedDices'] = shipCount
        giveUpState['rolling'] = true
        currentGameState.update(giveUpState)
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
                            let updateGameState = {}
                            updateGameState['dead'] = true
                            currentGameState.update(updateGameState)
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
        setTimeout(function(){
            for (let i = 0; i < numberDices; i++) {
                let str = instanceDices[i].id
                let res = str.replace("-selected", "");
                let ref = fire.database().ref("Room/Game/Dices/" + res)
                let updates = {}
                if (arrayValues[i] !== 'ship') {
                    updates['used'] = true
                }
                updates['rolling'] = false
                ref.update(updates)
            }
            let currentGameState = fire.database().ref("Room/Game/Stats")
            let giveUpState = {}
            giveUpState['rolling'] = false
            currentGameState.update(giveUpState)
        }, 1500);
    
}

const recursiveWinSearch = (index, arrayPlayers, winnerPoints, winnerName) => {
    let refPlayer = fire.database().ref("Room/Players/"+arrayPlayers[index])
    refPlayer.once("value", function(playerSnap) {
        let partialWinnerPoints = winnerPoints
        let partialWinnerName = winnerName
        if (winnerPoints < playerSnap.val().runes) {
            partialWinnerPoints = playerSnap.val().runes
            partialWinnerName = playerSnap.val().username
        }
        if (index !== (arrayPlayers.length-1)) {
            recursiveWinSearch(index+1, arrayPlayers, partialWinnerPoints, partialWinnerName)
        }
        else {
            let refStats = fire.database().ref("Room/Game/Stats/")
            let winnerStats = {
                "winner": {
                    "username": partialWinnerName,
                    "runes": partialWinnerPoints
                },
            }
            refStats.update(winnerStats)
        }
    })
}

export const giveUp = () => {
    let currentGameState = fire.database().ref("Room/Game/Stats")
    currentGameState.once("value", function(gameStateSnap) {
        if(!gameStateSnap.val().rolling){
            check()
        }
        else {
            setTimeout(giveUp, 200);
        }
    })
}


const check = () => {
    let ref = fire.database().ref("Room/Game/Dices/")
    ref.once("value", function (refSnap) {
        let notPlayed = true
        refSnap.val().forEach(element => {
            if (element.selected) {
                notPlayed = false
            }
        });
        if (notPlayed) {
            alert("No has jugat cap dau")
        }
        else {
            let randomDicePosition = getRandomDicePosition()
            let updates = {}
            randomDicePosition.forEach((element, key) => {
                updates[(key+1)] = {
                    "color": element,
                }
            });
            ref.update(updates)
            let selectedDicesBox = document.getElementById('selected-dices')
            selectedDicesBox.innerHTML = ''
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
                            let totalRunes = currentPlayerRunes + snapshot.val().partialRunes
                            updatePlayerState['runes'] = totalRunes
                            if (totalRunes >= 13 && !snapshot.val().winModeStartPlayer && !snapshot.val().extraTurn) {
                                updateGameState['winModeStartPlayer'] = playerTurn
                            }
                        }
                        updateGameState['partialRunes'] = 0
                        updateGameState['dead'] = false
                        
                        currentGameState.update(updateGameState)
                        currentPlayerState.update(updatePlayerState)
                    })
                })
            })
            let refTurn = fire.database().ref("Room/Game/Stats/")
            let updatesTurn = {}
            updatesTurn['giveup'] = true
            updatesTurn['selectedDices'] = 0
            refTurn.once("value", function(gameStateSnap) {
                let arrayPlayers = gameStateSnap.val().orderPlayers
                let currentPlayer = gameStateSnap.val().turn
                let indexP = arrayPlayers.indexOf(currentPlayer)
                let newArrayPlayers = []
                for(let i = 0; i < arrayPlayers.length; i++) {
                    let newIndx = indexP + i + 1
                    if (newIndx >= arrayPlayers.length) {
                        newIndx -= arrayPlayers.length
                    }
                    newArrayPlayers.push(arrayPlayers[newIndx])
                }
                //si no es extra-turn
                if(!gameStateSnap.val().extraTurn) {
                    updatesTurn['turn'] = newArrayPlayers[0]
                    if (gameStateSnap.val().winModeStartPlayer === newArrayPlayers[0]) {
                        //GAME OVER
                        recursiveWinSearch(0, newArrayPlayers, -1, "")
                        setTimeout(function(){ 
                            exitGame()
                        }, 6000)
                        
                    }
                }
                updatesTurn['extraTurn'] = false
                refTurn.update(updatesTurn)
            })
        }
    })
}

export const checkPlayersReady = (trans) => {
    let refPlayers = fire.database().ref("Room/Players")
    refPlayers.once("value", function(playersSnap) {
        let arrayPlayers = playersSnap.val()
        let playersReady = true
        Object.keys(arrayPlayers).forEach(element => {
            if (!arrayPlayers[element].ready) {
                playersReady = false
            }
        });
        if (playersReady) {
            toast.success(trans("toast.allPlayersReady"))
            createNewGame()
        }
        else {
            toast.warn(trans('toast.roomNotReady'));
        }
    })
}

const createNewGame = () => {
    let ref = fire.database().ref().child('Room').child('Game').child('Dices')
    let refStats = fire.database().ref("Room/Game/Stats")
    let refPlayers = fire.database().ref("Room/Players")
    let randomDicePosition = getRandomDicePosition()
    let updates = {}
    randomDicePosition.forEach((element, key) => {
        updates[(key+1)] = {
            "color": element,
        }
    });
    ref.update(updates)
    let updateStats = {}
    refPlayers.once("value", function(playersSnap) {
        let arrayPlayers = Object.keys(playersSnap.val())
        //Set runes, lives and valknut to 0
        arrayPlayers.forEach(player => {
            let refPlayer = fire.database().ref("Room/Players/"+player)
            let updatePlayerStats = {}
            updatePlayerStats['lives'] = 3
            updatePlayerStats['valknut'] = 0
            updatePlayerStats['runes'] = 0
            refPlayer.update(updatePlayerStats)
            
        });
        arrayPlayers = arrayPlayers.sort(function() {return Math.random() - 0.5})
        updateStats['turn'] = arrayPlayers[0]
        updateStats['orderPlayers'] = arrayPlayers
        updateStats['winModeStartPlayer'] = false
        updateStats['partialRunes'] = 0
        updateStats['playing'] = true
        updateStats['winner'] = {}
        updateStats['giveup'] = true
        updateStats['extraTurn'] = false
        updateStats['selectedDices'] = 0
        refStats.update(updateStats)
    })
}

export const flipCard = (e, alert3, alertDead, alertTurn)  => {
    //comprovar si es el teu torn
    let refStats = fire.database().ref("Room/Game/Stats")
    refStats.once("value", function(gameStats) {
        if (gameStats.val().turn === cookies.get('key')) {
            //comprovar si estas viu
            if (!gameStats.val().dead) {
                //if not flipped -> flip
                if (e.currentTarget.className === 'flip-card') {
                    if (document.getElementById('selected-dices').childElementCount === 3){
                        alert(alert3)
                    } else{
                        //+++++++++++++++++
                        let updateStats = {}
                        updateStats['giveup'] = false
                        updateStats['selectedDices'] = gameStats.val().selectedDices + 1
                        refStats.update(updateStats)
                        //+++++++++++++++
                        e.currentTarget.className += ' flip-card-flipped'
                        let ref = fire.database().ref("Room/Game/Dices/"+e.currentTarget.parentElement.id)
                        setTimeout(function(){ 
                            let updates = {}
                            updates['selected'] = true
                            ref.update(updates) },
                        300);
                    }
                    
                }
            }
            else {
                alert(alertDead)
            }
        }
        else {
            alert(alertTurn)
        }
    })
}

export const changeGameMode = () => {
    let refGameMode = fire.database().ref("Room/RoomState")
    //standart, hardcore
    refGameMode.once("value", function(gameModeSnap) {
        let updates = {}
        if (gameModeSnap.val().gameMode === 'standart') {
            updates['gameMode'] = 'hardcore'
        }
        else if (gameModeSnap.val().gameMode === 'hardcore') {
            updates['gameMode'] = 'standart'
        }
        refGameMode.update(updates)
    })
}

export const toggleReady = () => {
    let refPlayer = fire.database().ref("Room/Players/"+cookies.get('key'))
    refPlayer.once("value", function(playerStats) {
        let updates = {}
        updates['ready'] = !playerStats.val().ready
        refPlayer.update(updates)
    })
}

export const changeImgAvatar = (img) => {
    let refPlayer = fire.database().ref("Room/Players/"+cookies.get('key'))
    let updates = {}
    updates['imageUrl'] = img
    refPlayer.update(updates)
}

export const changeUsername = (name) => {
    let refPlayer = fire.database().ref("Room/Players/"+cookies.get('key'))
    let updates = {}
    updates['username'] = name
    refPlayer.update(updates)
}