import React from 'react';
import PropTypes from 'prop-types';
import '../../scss/main.scss';
import { Viking, Ship } from '../icon/icon';

export class Dice extends React.Component {
    flipCard(e) {
        if (e.currentTarget.className === 'flip-card') {
            e.currentTarget.className += ' flip-card-flipped'
        } else {
            e.currentTarget.className = 'flip-card'
        }
    }

    render () {
        return (
            <React.Fragment>
                <div className="flip-card" onClick={(e) => this.flipCard(e)}>
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <div className="icon">
                                <Viking/>
                            </div>
                        </div>
                        <div className={"flip-card-back flip-card-back--" + this.props.color}>
                            <div className="flipped-card-content">
                                <div className="card-information">
                                {this.props.symbol ?
                                <div className="icon">
                                    <Ship/>
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