import React, {useState} from 'react';
import fire from '../fire'
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';

let cookies = new Cookies();

const diceTypes = {
    "green": ["rune", "rune", "rune", "ship", "valknut", "damage"],
    "yellow": ["rune", "rune", "ship", "valknut", "damage", "damage"],
    "red": ["rune", "valknut", "ship", "damage", "damage", "damage"],
    // "blue": ['shield', 'helmet', 'damage', 'damage', 'valknut', 'ship'],
    // "black": ['horn', 'ham', 'beer', 'damage', 'damage', 'damage'],
}
const diceNumber = {
    "green": 11,
    "yellow": 9,
    "red": 7
    //"blue": 2
    //"black": 3 
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

export const exitGame = () => {
    let refStats = fire.database().ref("Room/Game/Stats/")
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
        if (value !== 'ship') {
            updates['used'] = true
        } else {
            shipCount += 1
        }
        updates['value'] = value
        arrayValues.push(value)
        ref.update(updates)
    }
    giveUpState['giveup'] = true
    giveUpState['selectedDices'] = shipCount
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
                }
            }
            refStats.update(winnerStats)
        }
    })
}

export const giveUp = () => {
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
                    let totalRunes = currentPlayerRunes + snapshot.val().partialRunes
                    updatePlayerState['runes'] = totalRunes
                    if (totalRunes >= 13 && !snapshot.val().winModeStartPlayer) {
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
        let currentPlayer = arrayPlayers[0]
        let newArrayPlayers = [...arrayPlayers]
        newArrayPlayers.shift()
        newArrayPlayers.push(currentPlayer)
        updatesTurn['turn'] = newArrayPlayers[0]
        if (gameStateSnap.val().winModeStartPlayer === newArrayPlayers[0]) {
            //GAME OVER
            recursiveWinSearch(0, newArrayPlayers, -1, "")
            setTimeout(function(){ 
                exitGame()
            }, 7000)
        }
        updatesTurn['orderPlayers'] = newArrayPlayers
        refTurn.update(updatesTurn)
    })
}

export const createNewGame = () => {
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
        updateStats['playing'] = true
        updateStats['winner'] = {}
        updateStats['giveup'] = true
        updateStats['selectedDices'] = 0
        refStats.update(updateStats)
    })
}

export const flipCard = (e)  => {
    //comprovar si es el teu torn
    let refStats = fire.database().ref("Room/Game/Stats")
    refStats.once("value", function(gameStats) {
        if (gameStats.val().turn === cookies.get('key')) {
            //comprovar si estas viu
            if (!gameStats.val().dead) {
                //if not flipped -> flip
                if (e.currentTarget.className === 'flip-card') {
                    if (document.getElementById('selected-dices').childElementCount === 3){
                        alert("Ja tens 3 daus seleccionats")
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
                alert("No pots seleccionar més daus un cop has mort")
            }
        }
        else {
            alert("No es el teu torn")
        }
    })
}

