import React from 'react';
import { useTranslation } from "react-i18next";
import { Dice } from "./dice/dice"
import Chat from './Chat'
import GameAction from './GameAction'
import { Valknut } from './icon/icon';
import Button from './Button';


export default function Game() {
    const [t] = useTranslation("global")
    return (
        <div className="c-game">
            <div className="c-game__players">
                <h1 className="c-game--title">{t('game.players').toUpperCase()}</h1>
                <div id="players" className="c-game__players--players">
                    
                </div>
                <div className="c-game__exit">
                    <Button text={t('game.exit').toUpperCase()} func={() =>{}}/>
                </div>
            </div>
            <div className="c-game__game">
                <h1 className="c-game--title">{t('game.title') + " VikingMorich"}</h1>
                <div className="c-game__dices">
                    <Dice color='green'/>
                    <Dice color='yellow'/>
                    <Dice color='red'/>
                    <Dice color='green'/>
                    <Dice color='yellow'/>
                    <Dice color='red'/>
                    <Dice color='green'/>
                    <Dice color='yellow'/>
                    <Dice color='red'/>
                    
                    <Dice color='green'/>
                    <Dice color='yellow'/>
                    <Dice color='red'/>
                    <Dice color='green'/>
                    <Dice color='yellow'/>
                    <Dice color='red'/>
                    <Dice color='green'/>
                    <Dice color='yellow'/>
                    <Dice color='red'/>
                    <Dice color='green'/>
                    <Dice color='yellow'/>
                    <Dice color='red'/>
                    <Dice color='green'/>
                    <Dice color='yellow'/>
                    <Dice color='red'/>
                    <Dice color='green'/>
                    <Dice color='yellow'/>
                    <Dice color='red'/>
                </div>
                <div className="c-game__interface">
                    <div className="c-game__selectedDices">
                        <span>{t('game.selectedDices').toUpperCase()}</span>
                        <div className="c-game__selected-wrapper">
                            <Dice color='green' symbol={true}/>
                            <Dice color='yellow' symbol={true}/>
                            <Dice color='red' symbol={true}/>
                        </div>
                    </div>
                    <Button text={t('game.roll').toUpperCase()} func={() =>{}}/>
                </div>
                <Chat type="game"/>
            </div>
            <div className="c-game__actions">
                <h1 className="c-game--title">{t('game.actions').toUpperCase()}</h1>
                <div className="c-game__actions--container" id="actions-container">

                </div>
                <div className="c-game__actions--value" id="valknut-points">
                    <div className="c-game__actions--valknut">
                        <Valknut />
                    </div>
                </div>
            </div>
        </div>
    );
}