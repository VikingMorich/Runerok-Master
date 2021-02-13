import React from 'react';

export default function RoomPlayer(props) {
    return (
        <div className="c-roomPlayer">
            <img src={props.imageUrl} alt="Runerok" className='c-roomPlayer__img'/>
            <div className="c-roomPlayer__info">
                <span className="c-roomPlayer__name">{props.userName}</span>
                <span className="c-roomPlayer__ready">{props.ready ? props.i18n('room.ready').toUpperCase() : props.i18n('room.noReady').toUpperCase()}</span>
            </div>
        </div>
    );
}