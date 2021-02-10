import React from 'react';
import { useTranslation } from "react-i18next";

export default function RoomPlayer(props) {
    const [t] = useTranslation("global")
    return (
        <div className="c-roomPlayer">
            <img src={props.imageUrl} alt="Runerok" className='c-roomPlayer__img'/>
            <div className="c-roomPlayer__info">
                <span className="c-roomPlayer__name">{props.userName}</span>
                <span className="c-roomPlayer__ready">{props.ready ? t('room.ready').toUpperCase() : t('room.noReady').toUpperCase()}</span>
            </div>
        </div>
    );
}