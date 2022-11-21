import React from 'react';
import fire from '../fire'
import Cookies from 'universal-cookie';
import { Damage, Rune, Malediction } from './icon/icon';


export default function GameAction(props) {
    let cookies = new Cookies();
    const extraPointsCost = 3
    const damageCost = 4
    const ghostCost = 5
    const greenCost = 4
    const redCost = 4
    const maledictionCost = 3
    const cleanCost = 2
    const seeCost = 2
    const extraTurnCost = 10

    function useAction() {
        let ref = fire.database().ref().child('Room').child('Players').child(cookies.get('key'))
        let updates = {}
        let actionType = props.type === 'see-dices' || props.type === 'see-dices-mobile' ? 'see-dices' : props.type === 'clean-state' || props.type === 'clean-state-mobile' ? 'clean-state' : props.type === 'red-dices' || props.type === 'red-dices-mobile' ? 'red-dices' : props.type === 'green-dices' || props.type === 'green-dices-mobile' ? 'green-dices' : props.type === 'ghost-dices' || props.type === 'ghost-dices-mobile' ? 'ghost-dices' : props.type === 'extra-points' || props.type === 'extra-points-mobile' ? 'extra-points' : props.type === 'damage' || props.type === 'damage-mobile' ? 'damage' : props.type === 'extra-turn' || props.type === 'extra-turn-mobile' ? 'extra-turn' : props.type === 'malediction' || props.type === 'malediction-mobile' ? 'malediction' : ''
        let actionCost = actionType === 'see-dices' ? seeCost : actionType === 'clean-state' ? cleanCost : actionType === 'red-dices' ? redCost : actionType === 'green-dices' ? greenCost : actionType === 'ghost-dices' ? ghostCost : actionType === 'extra-points' ? extraPointsCost : actionType === 'damage' ? damageCost : actionType === 'extra-turn' ? extraTurnCost : actionType === 'malediction' ? maledictionCost : 0
        updates['valknut'] = props.valknut - actionCost
        let stoppedAction = false
        if (actionType === 'extra-points'){
            let totalRunes = props.runes + 1
            updates['runes'] = totalRunes
        }
        if (actionType === 'ghost-dices') {
            let dices = document.getElementById('selected-dices').childNodes
            const numberDices = dices.length
            let defGame = fire.database().ref("Room/Game/Stats")
            defGame.once("value", function(nap) {
                if (nap.val().selectedDices === 0) {
                    alert('No hi ha daus seleccionats... 😅 Intenta ser més ràpid el proxim cop')
                } else {
                    let instanceDices =  { ...dices }
                    for (let i = 0; i < numberDices; i++) {
                        let str = instanceDices[i].id
                        let res = str.replace("-selected", "");
                        let ref = fire.database().ref("Room/Game/Dices/" + res)
                        let updates = {}
                        updates['value'] = 'ghost'
                        updates['rolling'] = false
                        updates['used'] = true
                        ref.update(updates)
                    }
                    let updateGame = {}
                    updateGame['selectedDices'] = 0
                    defGame.update(updateGame)
                }
            })
        }
        if (actionType === 'see-dices') {
            let defDices = fire.database().ref("Room/Game/Dices")
            defDices.once("value", function(diceSnap) {
                let currentState = diceSnap.val()
                diceSnap.val().forEach((element, key) => {
                    let diceRef = fire.database().ref("Room/Game/Dices/" + key)
                    let updates = {}
                    updates['selected'] = true
                    updates['used'] = true
                    diceRef.update(updates)
                });
                setTimeout(() => { 
                    currentState.forEach((element, key) => {
                        let diceRef = fire.database().ref("Room/Game/Dices/" + key)
                        let updates = {}
                        updates['selected'] = element.selected ? element.selected : false
                        updates['used'] = element.used ? element.used : false
                        diceRef.update(updates)
                    });
                }, 800);
                
            })
        }
        if (actionType === 'clean-state') {
            updates['state'] = 'normal'
        }
        if (actionType === 'green-dices') {
            let dices = document.getElementById('selected-dices').childNodes
            const numberDices = dices.length
            let instanceDices =  { ...dices }
            for (let i = 0; i < numberDices; i++) {
                let str = instanceDices[i].id
                let res = str.replace("-selected", "");
                let ref = fire.database().ref("Room/Game/Dices/" + res)
                let updates = {}
                updates['color'] = 'green'
                ref.update(updates)
            }
        }
        if (actionType === 'red-dices') {
            let dices = document.getElementById('selected-dices').childNodes
            const numberDices = dices.length
            let instanceDices =  { ...dices }
            for (let i = 0; i < numberDices; i++) {
                let str = instanceDices[i].id
                let res = str.replace("-selected", "");
                let ref = fire.database().ref("Room/Game/Dices/" + res)
                let updates = {}
                updates['color'] = 'red'
                ref.update(updates)
            }
        }
        if (actionType === 'malediction'){
            let currentTurn = fire.database().ref("Room/Game/Stats/turn")
            currentTurn.once("value", function(data) {
                if(data.val() === props.currentPlayer) {
                    delete updates.valknut
                    alert('Es el teu torn... 🧨🥴💣')
                    stoppedAction = true
                }
                else {
                    let userVal = fire.database().ref("Room/Players/"+data.val())
                    let updatesAction = { malediction: true}
                    userVal.update(updatesAction)
                }
            })
        }
        if (actionType === 'damage'){
            let livesVal
            let currentTurn = fire.database().ref("Room/Game/Stats/turn")
            currentTurn.once("value", function(data) {
                if(data.val() === props.currentPlayer) {
                    delete updates.valknut
                    alert('Es el teu torn... 🧨🥴💣')
                    stoppedAction = true
                }
                else {
                    let currentLives = fire.database().ref("Room/Players/"+data.val()+'/lives')
                    let userVal = fire.database().ref("Room/Players/"+data.val())
                    currentLives.once("value", function(snap) {
                        livesVal = snap.val();
                        let updatesAction = {}
                        let presentLives = livesVal - 1
                        updatesAction['lives'] = presentLives
                        userVal.update(updatesAction)
                        if (presentLives <= 0) {
                            let isDeadPlayer = fire.database().ref("Room/Game/Stats")
                            let updateDeadPlayer = {}
                            updateDeadPlayer['dead'] = true
                            isDeadPlayer.update(updateDeadPlayer)
                        } 
                    })
                }
            })
        }
        if (actionType === 'extra-turn'){
            let currentStats = fire.database().ref("Room/Game/Stats")
            let updateStats = {}
            updateStats['extraTurn'] = true
            currentStats.update(updateStats)
        }
        if (!stoppedAction) {
            let refAction = fire.database().ref().child('Room').child('Game').child('Actions')
            let key = refAction.push().key
            let updatesActions = {}
            updatesActions[key] = {
                message: actionType,
                user: cookies.get('userName')
            }
            refAction.update(updatesActions)
            setTimeout(function(){  
                fire.database().ref('Room/Game/Actions/' + key).remove()
            }, 3000);
            ref.update(updates)
        }
    }

    return (
        <React.Fragment>
            {props.type === 'extra-points' && 
            <div className={(props.valknut >= extraPointsCost)
                ? "c-action" : "c-action--disabled"} onClick={(props.valknut >= extraPointsCost) ? useAction : () => {}}>
                <div className="c-action__cost">
                <span>{extraPointsCost}</span>
                </div>
                <div className="c-action__info">
                    <span>{props.i18n('gameAction.extraPoints')}</span>
                </div>
            </div>
            }
            {props.type === 'extra-points-mobile' && 
            <div className={(props.valknut >= extraPointsCost)
                ? "c-action-mobile" : "c-action-mobile--disabled"} onClick={(props.valknut >= extraPointsCost) ? useAction : () => {}}>
                <div className="c-action__cost">
                    <span>{extraPointsCost}</span>
                </div>
                <div className="c-action__info">
                    <span>🤫</span>
                    <div className="c-action__info--icon">
                        <Rune />
                    </div>
                </div>
            </div>
            }
            {props.type === 'damage' && 
                <div className={(props.valknut >= damageCost) ? "c-action" : "c-action--disabled"} 
                onClick={(props.valknut >= damageCost) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span>{damageCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span>{props.i18n('gameAction.damage')}</span>
                    </div>
                </div>
            }
            {props.type === 'damage-mobile' && 
                <div className={(props.valknut >= damageCost) ? "c-action-mobile" : "c-action-mobile--disabled"} 
                onClick={(props.valknut >= damageCost) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span>{damageCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span>🥊</span>
                        <div className="c-action__info--icon">
                            <Damage />
                        </div>
                    </div>
                </div>
            }
            {props.type === 'extra-turn' && 
                <div id="extra-turn" className={(props.valknut >= extraTurnCost && props.turn) ? "c-action" : "c-action--disabled"}
                onClick={(props.valknut >= extraTurnCost && props.turn) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span>{extraTurnCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span>{props.i18n('gameAction.extraTurn')}</span>
                    </div>
                </div>
            }
            {props.type === 'extra-turn-mobile' && 
                <div id="extra-turn-mobile" className={(props.valknut >= extraTurnCost && props.turn) ? "c-action-mobile" : "c-action-mobile--disabled"}
                onClick={(props.valknut >= extraTurnCost && props.turn) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span>{extraTurnCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span>🔄⏳</span>
                    </div>
                </div>
            }
            {props.type === 'ghost-dices' && 
                <div id="ghost-dices" className={(props.valknut >= ghostCost) ? "c-action" : "c-action--disabled"}
                onClick={(props.valknut >= ghostCost) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span>{ghostCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span>{props.i18n('gameAction.ghostDices')}</span>
                    </div>
                </div>
            }
            {props.type === 'ghost-dices-mobile' && 
                <div id="ghost-dices-mobile" className={(props.valknut >= ghostCost) ? "c-action-mobile" : "c-action-mobile--disabled"}
                onClick={(props.valknut >= ghostCost) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span>{ghostCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span>👻⏹️</span>
                    </div>
                </div>
            }
            {props.type === 'green-dices' && 
                <div id="green-dices" className={(props.valknut >= greenCost) ? "c-action" : "c-action--disabled"}
                onClick={(props.valknut >= greenCost) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span>{greenCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span>{props.i18n('gameAction.greenDices')}</span>
                    </div>
                </div>
            }
            {props.type === 'green-dices-mobile' && 
                <div id="green-dices-mobile" className={(props.valknut >= greenCost) ? "c-action-mobile" : "c-action-mobile--disabled"}
                onClick={(props.valknut >= greenCost) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span>{greenCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span>🟩⏹️</span>
                    </div>
                </div>
            }
            {props.type === 'red-dices' && 
                <div id="red-dices" className={(props.valknut >= redCost) ? "c-action" : "c-action--disabled"}
                onClick={(props.valknut >= redCost) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span>{redCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span>{props.i18n('gameAction.redDices')}</span>
                    </div>
                </div>
            }
            {props.type === 'red-dices-mobile' && 
                <div id="red-dices-mobile" className={(props.valknut >= redCost) ? "c-action-mobile" : "c-action-mobile--disabled"}
                onClick={(props.valknut >= redCost) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span>{redCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span>🟥⏹️</span>
                    </div>
                </div>
            }
            {props.type === 'malediction' && 
                <div id="malediction" className={(props.valknut >= maledictionCost) ? "c-action" : "c-action--disabled"}
                onClick={(props.valknut >= maledictionCost) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span>{maledictionCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span>{props.i18n('gameAction.malediction')}</span>
                    </div>
                </div>
            }
            {props.type === 'malediction-mobile' && 
                <div id="malediction-mobile" className={(props.valknut >= maledictionCost) ? "c-action-mobile" : "c-action-mobile--disabled"}
                onClick={(props.valknut >= maledictionCost) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span>{maledictionCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span>🥊</span>
                        <div className="c-action__info--icon">
                            <Malediction />
                        </div>
                    </div>
                </div>
            }
            {props.type === 'clean-state' && 
                <div id="clean-state" className={(props.valknut >= cleanCost) ? "c-action" : "c-action--disabled"}
                onClick={(props.valknut >= cleanCost) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span>{cleanCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span>{props.i18n('gameAction.cleanState')}</span>
                    </div>
                </div>
            }
            {props.type === 'clean-state-mobile' && 
                <div id="clean-state-mobile" className={(props.valknut >= cleanCost) ? "c-action-mobile" : "c-action-mobile--disabled"}
                onClick={(props.valknut >= cleanCost) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span>{cleanCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span>🧽✨</span>
                    </div>
                </div>
            }
            {props.type === 'see-dices' && 
                <div id="see-dices" className={(props.valknut >= seeCost) ? "c-action" : "c-action--disabled"}
                onClick={(props.valknut >= seeCost) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span>{seeCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span>{props.i18n('gameAction.seeDices')}</span>
                    </div>
                </div>
            }
            {props.type === 'see-dices-mobile' && 
                <div id="see-dices-mobile" className={(props.valknut >= seeCost) ? "c-action-mobile" : "c-action-mobile--disabled"}
                onClick={(props.valknut >= seeCost) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span>{seeCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span>👁️⏹️</span>
                    </div>
                </div>
            }
            {/* ⏳🔄    🎖️🏅➕🤫🎣🧎🏻‍♂️    🥊🧨🪤🏴‍☠️  👻🟥🔲*/}
        </React.Fragment>
    );
}