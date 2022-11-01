import React from 'react';
import { useTranslation } from "react-i18next";
import Chat from './Chat'
import { Valknut, Rune } from './icon/icon'
import Button from './Button'
import { confirmExitGame } from './GameFunctions'

export default function Game() {
    const [t] = useTranslation("global")

    return (
        <div className="c-game">
            <div className="c-game__players">
                <h1 className="c-game--title">{t('game.players').toUpperCase()}</h1>
                <div id="players" className="c-game__players--players">
                    
                </div>
                <div className="c-game__exit">
                    <br/>
                    <Button text={t('game.exit').toUpperCase()} func={() => confirmExitGame(t('game.exitConfirmation'))}/>
                </div>
            </div>
            <div className="c-game__game">
                <h1 className="c-game--title c-game--turn">{t('game.title')}<span id="turn-title"></span></h1>
                <div className="c-game__dices">
                    <h3 className="c-game__dices--title">{t('game.diceTitle')}</h3>
                    <div className="c-game__dices--box" id="game-dices">

                    </div>
                </div>
                <div className="c-game__interface" id="user-view">
                    <div id="common-view">
                        <div className="c-game__partialRunes">
                            <span>{t('game.partialRunes').toUpperCase()}</span>
                            <span id="partial-runes"></span>
                            <div className="c-game__rune--watermark">
                                <Rune />
                            </div>
                        </div>
                        <div className="c-game__selectedDices">
                            <span>{t('game.selectedDices').toUpperCase()}</span>
                            <div className="c-game__selected-wrapper dice" id="selected-dices">

                            </div>
                        </div>
                        <div id="in-game-buttons">
                            
                        </div>
                    </div>
                </div>
                <Chat type="game"/>
            </div>
            <div className="c-game__actions">
                <h1 className="c-game--title c-game__actions--title">{t('game.actions').toUpperCase()}</h1>
                <div className="c-game__actions--container" id="actions-container">

                </div>
                <div className="c-game__actions--value" id="valknut-points">
                    <div className="c-game__actions--valknut">
                        <Valknut />
                    </div>
                </div>
            </div>
            <div className="c-game__other-mobile-buttons">
                <Button text={t('game.exit').toUpperCase()} func={() => confirmExitGame(t('game.exitConfirmation'))}/>
            </div>
        </div>
    );
}