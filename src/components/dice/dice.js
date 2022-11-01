import React from 'react';
import '../../scss/main.scss';
import { Viking, Ship, Damage, Rune, Valknut, Beer, Helmet, Shield, Horn, Critical, Ham } from '../icon/icon';
import { flipCard } from "../GameFunctions"

export default function Dice(props) {
    return (
        <React.Fragment>
            <div className={"flip-card" + (props.selected ? ' flip-card-flipped' : '')} onClick={(e) => flipCard(e, props.i18n('game.diceAlert3'), props.i18n('game.diceAlertDead'), props.i18n('game.diceAlertTurn'))}>
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <div className="icon">
                            <Viking/>
                        </div>
                    </div>
                    <div className={"flip-card-back flip-card-back--" + props.color}>
                        <div className="flipped-card-content">
                            <div className="card-information">
                            {
                            props.value === 'damage' ?
                            <div className="icon">
                                <Damage/>
                            </div>
                            :
                            props.value === 'ship' ?
                            <div className="icon">
                                <Ship/>
                            </div>
                            :
                            props.value === 'valknut' ?
                            <div className="icon">
                                <Valknut/>
                            </div>
                            :
                            props.value === 'rune' ?
                            <div className="icon">
                                <Rune/>
                            </div>
                            :
                            props.value === 'beer' ?
                            <div className="icon">
                                <Beer/>
                            </div>
                            :
                            props.value === 'helmet' ?
                            <div className="icon">
                                <Helmet/>
                            </div>
                            :
                            props.value === 'shield' ?
                            <div className="icon">
                                <Shield/>
                            </div>
                            :
                            props.value === 'horn' ?
                            <div className="icon">
                                <Horn/>
                            </div>
                            :
                            props.value === 'critical' ?
                            <div className="icon">
                                <Critical/>
                            </div>
                            :
                            props.value === 'ham' ?
                            <div className="icon">
                                <Ham/>
                            </div>
                            :
                            <React.Fragment />
                            }  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}