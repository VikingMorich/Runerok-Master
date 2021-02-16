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
        ref.update(updates)
    }

    return (
        <div className={((props.type === 'extra-points' && props.valknut >= extraPointsCost) ||
        (props.type === 'damage' && props.valknut >= damageCost))
        ? "c-action" : "c-action--disabled"} onClick={useAction}>
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