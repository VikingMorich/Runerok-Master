import React from 'react';
import { useTranslation } from "react-i18next";
import fire from '../fire'
import Cookies from 'universal-cookie';

export default function GameAction(props) {
    let cookies = new Cookies();
    const extraPointsCost = 2
    const damageCost = 3
    const [t] = useTranslation("global")

    function useAction() {
        let ref = fire.database().ref().child('Room').child('Players').child(cookies.get('key'))
        let updates = {}
        let actionCost = props.type === 'extra-points' ? extraPointsCost : props.type === 'damage' ? damageCost : 0
        updates['valknut'] = props.valknut - actionCost
        if (props.type === 'extra-points'){
            updates['runes'] = props.runes + 1 
        }
        if (props.type === 'damage'){
            let livesVal
            let currentTurn = fire.database().ref("Room/Game/Stats/turn")
            currentTurn.once("value", function(data) {
                console.log(data.val());
                let currentLives = fire.database().ref("Room/Players/"+data.val()+'/lives')
                let userVal = fire.database().ref("Room/Players/"+data.val())
                currentLives.once("value", function(snap) {
                    livesVal = snap.val();
                    console.log(snap.val());
                    let updatesAction = {}
                    updatesAction['lives'] = livesVal - 1
                    userVal.update(updatesAction)
                })
            })
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
        <div className={((props.type === 'extra-points' && props.valknut >= extraPointsCost) ||
        (props.type === 'damage' && props.valknut >= damageCost))
        ? "c-action" : "c-action--disabled"} onClick={((props.type === 'extra-points' && props.valknut >= extraPointsCost) ||
        (props.type === 'damage' && props.valknut >= damageCost)) ? useAction : () => {}}>
            {props.type === 'extra-points' && 
            <React.Fragment>
                <div className="c-action__cost">
                <span className="c-roomPlayer__name">{extraPointsCost}</span>
                </div>
                <div className="c-action__info">
                    <span className="c-roomPlayer__name">{props.i18n('gameAction.extraPoints')}</span>
                </div>
            </React.Fragment>
            }
            {props.type === 'damage' && 
            <React.Fragment>
                <div className="c-action__cost">
                <span className="c-roomPlayer__name">{damageCost}</span>
                </div>
                <div className="c-action__info">
                    <span className="c-roomPlayer__name">{props.i18n('gameAction.damage')}</span>
                </div>
            </React.Fragment>
            }
        </div>
    );
}