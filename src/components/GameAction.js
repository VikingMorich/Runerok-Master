import React from 'react';
import { useTranslation } from "react-i18next";
import fire from '../fire'
import Cookies from 'universal-cookie';
import { Damage, Rune } from './icon/icon';


export default function GameAction(props) {
    let cookies = new Cookies();
    const extraPointsCost = 2
    const damageCost = 3
    const extraTurnCost = 10
    const [t] = useTranslation("global")

    function useAction() {
        let ref = fire.database().ref().child('Room').child('Players').child(cookies.get('key'))
        let updates = {}
        let actionType = props.type === 'extra-points' || props.type === 'extra-points-mobile' ? 'extra-points' : props.type === 'damage' || props.type === 'damage-mobile' ? 'damage' : props.type === 'extra-turn' || props.type === 'extra-turn-mobile' ? 'extra-turn' : ''
        let actionCost = actionType === 'extra-points' ? extraPointsCost : actionType === 'damage' ? damageCost : actionType === 'extra-turn' ? extraTurnCost : 0
        updates['valknut'] = props.valknut - actionCost
        if (actionType === 'extra-points'){
            let totalRunes = props.runes + 1
            updates['runes'] = totalRunes
        }
        if (actionType === 'damage'){
            let livesVal
            let currentTurn = fire.database().ref("Room/Game/Stats/turn")
            currentTurn.once("value", function(data) {
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
            })
        }
        if (actionType === 'extra-turn'){
            let currentStats = fire.database().ref("Room/Game/Stats")
            let updateStats = {}
            updateStats['extraTurn'] = true
            currentStats.update(updateStats)
        }
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

    return (
        <React.Fragment>
            {props.type === 'extra-points' && 
            <div className={(props.type === 'extra-points' && props.valknut >= extraPointsCost)
                ? "c-action" : "c-action--disabled"} onClick={(props.type === 'extra-points' && props.valknut >= extraPointsCost) ? useAction : () => {}}>
                <div className="c-action__cost">
                <span className="c-roomPlayer__name">{extraPointsCost}</span>
                </div>
                <div className="c-action__info">
                    <span className="c-roomPlayer__name">{props.i18n('gameAction.extraPoints')}</span>
                </div>
            </div>
            }
            {props.type === 'extra-points-mobile' && 
            <div className={(props.type === 'extra-points-mobile' && props.valknut >= extraPointsCost)
                ? "c-action-mobile" : "c-action-mobile--disabled"} onClick={(props.type === 'extra-points-mobile' && props.valknut >= extraPointsCost) ? useAction : () => {}}>
                <div className="c-action__cost">
                    <span className="c-roomPlayer__name">{extraPointsCost}</span>
                </div>
                <div className="c-action__info">
                    <span className="c-roomPlayer__name">🤫</span>
                    <div className="c-action__info--icon">
                        <Rune />
                    </div>
                </div>
            </div>
            }
            {props.type === 'damage' && 
                <div className={(props.type === 'damage' && props.valknut >= damageCost) ? "c-action" : "c-action--disabled"} 
                onClick={(props.type === 'damage' && props.valknut >= damageCost) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span className="c-roomPlayer__name">{damageCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span className="c-roomPlayer__name">{props.i18n('gameAction.damage')}</span>
                    </div>
                </div>
            }
            {props.type === 'damage-mobile' && 
                <div className={(props.type === 'damage-mobile' && props.valknut >= damageCost) ? "c-action-mobile" : "c-action-mobile--disabled"} 
                onClick={(props.type === 'damage-mobile' && props.valknut >= damageCost) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span className="c-roomPlayer__name">{damageCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span className="c-roomPlayer__name">🥊</span>
                        <div className="c-action__info--icon">
                            <Damage />
                        </div>
                    </div>
                </div>
            }
            {props.type === 'extra-turn' && 
                <div id="extra-turn" className={(props.type === 'extra-turn' && props.valknut >= extraTurnCost && props.turn) ? "c-action" : "c-action--disabled"} onClick={(props.type === 'extra-turn' && props.valknut >= extraTurnCost && props.turn) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span className="c-roomPlayer__name">{extraTurnCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span className="c-roomPlayer__name">{props.i18n('gameAction.extraTurn')}</span>
                    </div>
                </div>
            }
            {props.type === 'extra-turn-mobile' && 
                <div id="extra-turn-mobile" className={(props.type === 'extra-turn-mobile' && props.valknut >= extraTurnCost && props.turn) ? "c-action-mobile" : "c-action-mobile--disabled"} onClick={(props.type === 'extra-turn-mobile' && props.valknut >= extraTurnCost && props.turn) ? useAction : () => {}}>
                    <div className="c-action__cost">
                    <span className="c-roomPlayer__name">{extraTurnCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span className="c-roomPlayer__name">🔄⏳</span>
                    </div>
                </div>
            }
            {/* ⏳🔄    🎖️🏅➕🤫🎣🧎🏻‍♂️    🥊🧨🪤🏴‍☠️ */}
        </React.Fragment>
    );
}