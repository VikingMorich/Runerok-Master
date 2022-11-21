import React from 'react';
import {Heart, Rune, Valknut, Helmet, Shield, Mushroom, Thunder, Book, Malediction} from './icon/icon'

export default function GamePlayer(props) {
    return (
        <div className={props.gamePlayerData.userTurn ? 'c-gamePlayer': 'c-gamePlayer c-gamePlayer--notTurn'}>
            {props.gamePlayerData.extraTurn && props.gamePlayerData.userTurn && <div className='c-gamePlayer__extra-container'>
                ⏳
            </div>}
            {props.gamePlayerData.malediction && <div className='c-gamePlayer__malediction'>
                <Malediction />
            </div>}
            <div className='c-gamePlayer__img-wrapper'>
                <img src={props.gamePlayerData.imageUrl} alt="Runerok" className='c-gamePlayer__img'/>
                <div className='c-gamePlayer__state-wrapper'>
                    {props.gamePlayerData.gameMode === 'hardcore' && props.gamePlayerData.state === 'mushroom' && <div className='state-icon'>
                        <Mushroom />
                    </div>}
                    {props.gamePlayerData.gameMode === 'hardcore' && props.gamePlayerData.state === 'thunder' && <div className='state-icon'>
                        <Thunder />
                    </div>}
                </div>
            </div>
            <div className="info-wrapper">
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
                </div>
                {props.gamePlayerData.gameMode === 'hardcore' && <div className='c-gamePlayer__ext'>
                    <div className='c-gamePlayer__armor'>
                        <span>{props.i18n('game.armor')}</span>
                        {props.gamePlayerData.helmet && <div className={"c-gamePlayer__icon--img " + (props.gamePlayerData.helmetUsed && "armor-used")}>
                            <Helmet />
                        </div>}
                        {props.gamePlayerData.shield && <div className={"c-gamePlayer__icon--img " + (props.gamePlayerData.shieldUsed && "armor-used")}>
                            <Shield />
                        </div>}
                        {!props.gamePlayerData.helmet && !props.gamePlayerData.shield && <div> - </div>}
                    </div>
                    <div className='c-gamePlayer__book-wrap'>
                        <div className='book-icon'>
                            <Book />
                        </div>
                        <span>{props.gamePlayerData.bookLvl}</span>
                    </div>
                </div>}
            </div>
        </div>
    );
}