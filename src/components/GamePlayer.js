import React from 'react';
import {Heart, Rune, Valknut, Helmet, Shield} from './icon/icon'

export default function GamePlayer(props) {
    
    return (
        <div className={props.userTurn ? 'c-gamePlayer': 'c-gamePlayer c-gamePlayer--notTurn'}>
            <img src={props.imageUrl} alt="Runerok" className='c-gamePlayer__img'/>
            <div className="c-gamePlayer__info">
                <span className="c-gamePlayer__name">{props.userName}</span>
                <div className="c-gamePlayer__stats">
                    <div className="c-gamePlayer__icon">
                        <div className="c-gamePlayer__icon--img">
                            <Rune />
                        </div>
                        <span>{props.runes}</span>
                    </div>
                    <div className="c-gamePlayer__icon">
                        <div className="c-gamePlayer__icon--img">
                            <Heart></Heart>
                        </div>
                        <span>{props.lives}</span>
                    </div>
                    <div className="c-gamePlayer__icon">
                        <div className="c-gamePlayer__icon--img">
                            <Valknut></Valknut>
                        </div>
                        <span>{props.valknut}</span>
                    </div>
                </div>
                {props.gameMode === 'hardcore' && <div className='c-gamePlayer__armor'>
                    <span>{props.i18n('game.armor')}</span>
                    <div className="c-gamePlayer__icon--img">
                        <Helmet />
                    </div>
                    <div className="c-gamePlayer__icon--img armor-used">
                        <Shield />
                    </div>
                </div>}
            </div>
        </div>
    );
}