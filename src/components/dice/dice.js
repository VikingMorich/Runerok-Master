import React from 'react';
import PropTypes from 'prop-types';
import '../../scss/main.scss';
import fire from '../../fire'
import { Viking, Ship, Damage, Rune, Valknut } from '../icon/icon';
import { flipCard } from "../GameFunctions"

export class Dice extends React.Component {

    render () {
        return (
            <React.Fragment>
                <div className={"flip-card" + (this.props.selected ? ' flip-card-flipped' : '')} onClick={(e) => flipCard(e)}>
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <div className="icon">
                                <Viking/>
                            </div>
                        </div>
                        <div className={"flip-card-back flip-card-back--" + this.props.color}>
                            <div className="flipped-card-content">
                                <div className="card-information">
                                {
                                this.props.value === 'damage' ?
                                <div className="icon">
                                    <Damage/>
                                </div>
                                :
                                this.props.value === 'ship' ?
                                <div className="icon">
                                    <Ship/>
                                </div>
                                :
                                this.props.value === 'valknut' ?
                                <div className="icon">
                                    <Valknut/>
                                </div>
                                :
                                this.props.value === 'rune' ?
                                <div className="icon">
                                    <Rune/>
                                </div>
                                :
                                <span>{this.props.color.toUpperCase()}</span>
                                }  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

Dice.propTypes = {
    color: PropTypes.string
};

Dice.defaultProps = {
    color: 'green'
};