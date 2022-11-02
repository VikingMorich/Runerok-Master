import React from 'react';
import {Heart, Rune, Valknut, Helmet, Shield} from './icon/icon'

export default function GamePlayer(props) {
    return (
        <div className={props.gamePlayerData.userTurn ? 'c-gamePlayer': 'c-gamePlayer c-gamePlayer--notTurn'}>
            <img src={props.gamePlayerData.imageUrl} alt="Runerok" className='c-gamePlayer__img'/>
            <div className="c-gamePlayer__info">
                <span className="c-gamePlayer__name">{props.gamePlayerData.userName}</span>
                <div className="c-gamePlayer__stats">
                    <div className="c-gamePlayer__icon">
                        <div className="c-gamePlayer__icon--img">
                            <Rune />
                        </div>
                        <span>{props.gamePlayerData.runes}</span>
                    </div>
                    <div className="c-gamePlayer__icon">
                        <div className="c-gamePlayer__icon--img">
                            <Heart></Heart>
                        </div>
                        <span>{props.gamePlayerData.lives}</span>
                    </div>
                    <div className="c-gamePlayer__icon">
                        <div className="c-gamePlayer__icon--img">
                            <Valknut></Valknut>
                        </div>
                        <span>{props.gamePlayerData.valknut}</span>
                    </div>
                </div>
                {props.gamePlayerData.gameMode === 'hardcore' && <div className='c-gamePlayer__armor'>
                    <span>{props.i18n('game.armor')}</span>
                    {props.gamePlayerData.helmet && <div className={"c-gamePlayer__icon--img " + (props.gamePlayerData.helmetUsed && "armor-used")}>
                        <Helmet />
                    </div>}
                    {props.gamePlayerData.shield && <div className={"c-gamePlayer__icon--img " + (props.gamePlayerData.shieldUsed && "armor-used")}>
                        <Shield />
                    </div>}
                </div>}
            </div>
        </div>
    );
}