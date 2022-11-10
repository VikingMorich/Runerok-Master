import React from 'react';
import fire from '../fire'
import Cookies from 'universal-cookie';
import { Damage, Rune } from './icon/icon';


export default function GameAction(props) {
    let cookies = new Cookies();
    const extraPointsCost = 2
    const damageCost = 3
    const ghostCost = 5
    const extraTurnCost = 10

    function useAction() {
        let ref = fire.database().ref().child('Room').child('Players').child(cookies.get('key'))
        let updates = {}
        let actionType = props.type === 'ghost-dices' || props.type === 'ghost-dices-mobile' ? 'ghost-dices' : props.type === 'extra-points' || props.type === 'extra-points-mobile' ? 'extra-points' : props.type === 'damage' || props.type === 'damage-mobile' ? 'damage' : props.type === 'extra-turn' || props.type === 'extra-turn-mobile' ? 'extra-turn' : ''
        let actionCost = actionType === 'ghost-dices' ? ghostCost : actionType === 'extra-points' ? extraPointsCost : actionType === 'damage' ? damageCost : actionType === 'extra-turn' ? extraTurnCost : 0
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
                //REVISAR PQ ES PODEN FER COSES RARES SI QUEDA ALGUN DAU SELECCIONAT AMB VAIXELL
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
            {/* ⏳🔄    🎖️🏅➕🤫🎣🧎🏻‍♂️    🥊🧨🪤🏴‍☠️  👻🔲*/}
        </React.Fragment>
    );
}