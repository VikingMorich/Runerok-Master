import React from 'react';
import { useTranslation } from "react-i18next";
import fire from '../fire'
import Cookies from 'universal-cookie';


export default function GameAction(props) {
    let cookies = new Cookies();
    const extraPointsCost = 2
    const damageCost = 3
    const extraTurnCost = 10
    const [t] = useTranslation("global")

    function useAction() {
        let ref = fire.database().ref().child('Room').child('Players').child(cookies.get('key'))
        let updates = {}
        let actionCost = props.type === 'extra-points' ? extraPointsCost : props.type === 'damage' ? damageCost : props.type === 'extra-turn' ? extraTurnCost : 0
        updates['valknut'] = props.valknut - actionCost
        if (props.type === 'extra-points'){
            let totalRunes = props.runes + 1
            updates['runes'] = totalRunes
        }
        if (props.type === 'damage'){
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
        if (props.type === 'extra-turn'){
            let currentStats = fire.database().ref("Room/Game/Stats")
            let updateStats = {}
            updateStats['extraTurn'] = true
            currentStats.update(updateStats)
        }
        let refAction = fire.database().ref().child('Room').child('Game').child('Actions')
        let key = refAction.push().key
        let updatesActions = {}
        updatesActions[key] = {
            message: props.type,
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
        </React.Fragment>
    );
}