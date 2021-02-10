import React from 'react';

import { Dice } from '../components/dice/dice';

export default {
  title: 'Runerok/Dice',
};

export const DiceExample = () => {
    return (
        <div style={{display: 'flex'}}>
            <Dice color='green'/>
            <Dice color='yellow'/>
            <Dice color='red'/>
        </div>
    )
};

