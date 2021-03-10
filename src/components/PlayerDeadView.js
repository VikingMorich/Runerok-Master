import React from 'react';
import { Skull } from './icon/icon';
import Button from './Button';
import { giveUp } from './GameFunctions'

export default function PlayerDeadView(props) {

    return (
        <React.Fragment>
            <div className="c-game__skull">
                <Skull/>
            </div>
            <span className="c-game__skull--text">{props.i18n('game.dead').toUpperCase()}</span>
            <Button text={props.i18n('game.changeTurn').toUpperCase()} func={giveUp}/> 
        </React.Fragment>
    );
}