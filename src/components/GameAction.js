import React from 'react';
import fire from '../fire'
import Cookies from 'universal-cookie';
import { Damage, Rune, Malediction, Book } from './icon/icon';


//export default function GameAction(props) {
export default class GameAction extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            count: 1,
            cookies: new Cookies(),
            extraPointsCost: 3,
            damageCost: 4,
            ghostCost: 5,
            greenCost: 4,
            redCost: 4,
            maledictionCost: 3,
            cleanCost: 2,
            seeCost: 2,
            extraTurnCost: 10
        }
        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
    }
    increment () {
        this.setState((state) => {
            return {
                count: state.count + 1
            };
        });
    }

    decrement () {
        this.setState((state) => {
            return {
                count: state.count - 1 <= 0 ? 1 : state.count - 1
            }
        })
    }

    useAction(context) {
        let ref = fire.database().ref().child('Room').child('Players').child(context.state.cookies.get('key'))
        let updates = {}
        let actionType = context.props.type === 'see-dices' || context.props.type === 'see-dices-mobile' ? 'see-dices' : context.props.type === 'clean-state' || context.props.type === 'clean-state-mobile' ? 'clean-state' : context.props.type === 'red-dices' || context.props.type === 'red-dices-mobile' ? 'red-dices' : context.props.type === 'green-dices' || context.props.type === 'green-dices-mobile' ? 'green-dices' : context.props.type === 'ghost-dices' || context.props.type === 'ghost-dices-mobile' ? 'ghost-dices' : context.props.type === 'extra-points' || context.props.type === 'extra-points-mobile' ? 'extra-points' : context.props.type === 'damage' || context.props.type === 'damage-mobile' ? 'damage' : context.props.type === 'extra-turn' || context.props.type === 'extra-turn-mobile' ? 'extra-turn' : context.props.type === 'malediction' || context.props.type === 'malediction-mobile' ? 'malediction' : ''
        let actionCost = actionType === 'see-dices' ? context.state.seeCost : actionType === 'clean-state' ? context.state.cleanCost : actionType === 'red-dices' ? context.state.redCost : actionType === 'green-dices' ? context.state.greenCost : actionType === 'ghost-dices' ? context.state.ghostCost : actionType === 'extra-points' ? context.state.extraPointsCost : actionType === 'damage' ? context.state.damageCost : actionType === 'extra-turn' ? context.state.extraTurnCost : actionType === 'malediction' ? context.state.maledictionCost : 0
        actionCost = actionCost * context.state.count
        updates['valknut'] = context.props.valknut - actionCost
        let stoppedAction = false
        if (actionType === 'extra-points'){
            let totalRunes = context.props.runes + context.state.count
            updates['runes'] = totalRunes
        }
        if (actionType === 'ghost-dices') {
            let dices = document.getElementById('selected-dices').childNodes
            const numberDices = dices.length
            let defGame = fire.database().ref("Room/Game/Stats")
            defGame.once("value", function(nap) {
                if (nap.val().selectedDices === 0) {
                    alert('No hi ha daus seleccionats... 😅 Intenta ser més ràpid el proxim cop')
                } else {
                    let instanceDices =  { ...dices }
                    for (let i = 0; i < numberDices; i++) {
                        let str = instanceDices[i].id
                        let res = str.replace("-selected", "");
                        let ref = fire.database().ref("Room/Game/Dices/" + res)
                        let updates = {}
                        updates['value'] = 'ghost'
                        updates['rolling'] = false
                        updates['used'] = true
                        ref.update(updates)
                    }
                    let updateGame = {}
                    updateGame['selectedDices'] = 0
                    defGame.update(updateGame)
                }
            })
        }
        if (actionType === 'see-dices') {
            let defDices = fire.database().ref("Room/Game/Dices")
            defDices.once("value", function(diceSnap) {
                let currentState = diceSnap.val()
                diceSnap.val().forEach((element, key) => {
                    let diceRef = fire.database().ref("Room/Game/Dices/" + key)
                    let updates = {}
                    updates['selected'] = true
                    updates['used'] = true
                    diceRef.update(updates)
                });
                setTimeout(() => { 
                    currentState.forEach((element, key) => {
                        let diceRef = fire.database().ref("Room/Game/Dices/" + key)
                        let updates = {}
                        updates['selected'] = element.selected ? element.selected : false
                        updates['used'] = element.used ? element.used : false
                        diceRef.update(updates)
                    });
                }, 800);
                
            })
        }
        if (actionType === 'clean-state') {
            updates['state'] = 'normal'
        }
        if (actionType === 'green-dices') {
            let dices = document.getElementById('selected-dices').childNodes
            const numberDices = dices.length
            let instanceDices =  { ...dices }
            for (let i = 0; i < numberDices; i++) {
                let str = instanceDices[i].id
                let res = str.replace("-selected", "");
                let ref = fire.database().ref("Room/Game/Dices/" + res)
                let updates = {}
                updates['color'] = 'green'
                ref.update(updates)
            }
        }
        if (actionType === 'red-dices') {
            let dices = document.getElementById('selected-dices').childNodes
            const numberDices = dices.length
            let instanceDices =  { ...dices }
            for (let i = 0; i < numberDices; i++) {
                let str = instanceDices[i].id
                let res = str.replace("-selected", "");
                let ref = fire.database().ref("Room/Game/Dices/" + res)
                let updates = {}
                updates['color'] = 'red'
                ref.update(updates)
            }
        }
        if (actionType === 'malediction'){
            let currentTurn = fire.database().ref("Room/Game/Stats/turn")
            currentTurn.once("value", function(data) {
                if(data.val() === context.props.currentPlayer) {
                    delete updates.valknut
                    alert('Es el teu torn... 🧨🥴💣')
                    stoppedAction = true
                }
                else {
                    let userVal = fire.database().ref("Room/Players/"+data.val())
                    let updatesAction = { malediction: true}
                    userVal.update(updatesAction)
                }
            })
        }
        if (actionType === 'damage'){
            let livesVal
            let currentTurn = fire.database().ref("Room/Game/Stats/turn")
            currentTurn.once("value", function(data) {
                if(data.val() === context.props.currentPlayer) {
                    delete updates.valknut
                    alert('Es el teu torn... 🧨🥴💣')
                    stoppedAction = true
                }
                else {
                    let currentLives = fire.database().ref("Room/Players/"+data.val()+'/lives')
                    let userVal = fire.database().ref("Room/Players/"+data.val())
                    currentLives.once("value", function(snap) {
                        livesVal = snap.val();
                        let updatesAction = {}
                        let presentLives = livesVal - context.state.count
                        updatesAction['lives'] = presentLives
                        userVal.update(updatesAction)
                        if (presentLives <= 0) {
                            let isDeadPlayer = fire.database().ref("Room/Game/Stats")
                            let updateDeadPlayer = {}
                            updateDeadPlayer['dead'] = true
                            isDeadPlayer.update(updateDeadPlayer)
                        } 
                    })
                }
            })
        }
        if (actionType === 'extra-turn'){
            let currentStats = fire.database().ref("Room/Game/Stats")
            let updateStats = {}
            updateStats['extraTurn'] = true
            currentStats.update(updateStats)
        }
        if (!stoppedAction) {
            let refAction = fire.database().ref().child('Room').child('Game').child('Actions')
            let key = refAction.push().key
            let updatesActions = {}
            updatesActions[key] = {
                message: actionType + (context.state.count > 1 ? ' x' + context.state.count : ''),
                user: context.state.cookies.get('userName')
            }
            refAction.update(updatesActions)
            setTimeout(function(){  
                fire.database().ref('Room/Game/Actions/' + key).remove()
            }, 3000);
            ref.update(updates)
        }
        //SET STATE COUNT TO 1
        context.setState((state) => {
            return {
                count: 1
            }
        })
    }
    render () {
        return (
            <React.Fragment>
                {this.props.type === 'extra-points' && 
                <div className={(this.props.valknut >= this.state.extraPointsCost * this.state.count)
                    ? "c-action" : "c-action--disabled"}>
                    <div className="c-action__cost">
                    <span>{this.state.extraPointsCost * this.state.count}</span>
                    </div>
                    <div className="c-action__info" onClick={(this.props.valknut >= this.state.extraPointsCost * this.state.count) ? () => this.useAction(this) : () => {}}>
                        <span>{this.props.i18n('gameAction.extraPoints')}</span>
                    </div>
                    <div className='counter__container'>
                        <div className='counter__button' onClick={this.decrement}>
                            <p className="counter__button--value">-</p>
                        </div>
                        <div className="counter__screen">
                            <p className="counter__value">{this.state.count}</p>
                        </div>
                        <div className='counter__button' onClick={this.increment}>
                            <p className="counter__button--value">+</p>
                        </div>
                    </div>
                </div>
                }
                {this.props.type === 'extra-points-mobile' && 
                <div className={(this.props.valknut >= this.state.extraPointsCost)
                    ? "c-action-mobile" : "c-action-mobile--disabled"} onClick={(this.props.valknut >= this.state.extraPointsCost) ? () => this.useAction(this) : () => {}}>
                    <div className="c-action__cost">
                        <span>{this.state.extraPointsCost}</span>
                    </div>
                    <div className="c-action__info">
                        <span>🤫</span>
                        <div className="c-action__info--icon">
                            <Rune />
                        </div>
                    </div>
                </div>
                }
                {this.props.type === 'damage' && 
                    <div className={(this.props.valknut >= this.state.damageCost * this.state.count) ? "c-action" : "c-action--disabled"}>
                        <div className="c-action__cost">
                        <span>{this.state.damageCost * this.state.count}</span>
                        </div>
                        <div className="c-action__info" onClick={(this.props.valknut >= this.state.damageCost * this.state.count) ? () => this.useAction(this) : () => {}}>
                            <span>{this.props.i18n('gameAction.damage')}</span>
                        </div>
                        <div className='counter__container'>
                            <div className='counter__button' onClick={this.decrement}>
                                <p className="counter__button--value">-</p>
                            </div>
                            <div className="counter__screen">
                                <p className="counter__value">{this.state.count}</p>
                            </div>
                            <div className='counter__button' onClick={this.increment}>
                                <p className="counter__button--value">+</p>
                            </div>
                        </div>
                    </div>
                }
                {this.props.type === 'damage-mobile' && 
                    <div className={(this.props.valknut >= this.state.damageCost) ? "c-action-mobile" : "c-action-mobile--disabled"} 
                    onClick={(this.props.valknut >= this.state.damageCost) ? () => this.useAction(this) : () => {}}>
                        <div className="c-action__cost">
                        <span>{this.state.damageCost}</span>
                        </div>
                        <div className="c-action__info">
                            <span>🥊</span>
                            <div className="c-action__info--icon">
                                <Damage />
                            </div>
                        </div>
                    </div>
                }
                {this.props.type === 'extra-turn' && 
                    <div id="extra-turn" className={(this.props.valknut >= this.state.extraTurnCost && this.props.turn) ? "c-action" : "c-action--disabled"}
                    onClick={(this.props.valknut >= this.state.extraTurnCost && this.props.turn) ? () => this.useAction(this) : () => {}}>
                        <div className="c-action__cost">
                        <span>{this.state.extraTurnCost}</span>
                        </div>
                        <div className="c-action__info">
                            <span>{this.props.i18n('gameAction.extraTurn')}</span>
                        </div>
                    </div>
                }
                {this.props.type === 'extra-turn-mobile' && 
                    <div id="extra-turn-mobile" className={(this.props.valknut >= this.state.extraTurnCost && this.props.turn) ? "c-action-mobile" : "c-action-mobile--disabled"}
                    onClick={(this.props.valknut >= this.state.extraTurnCost && this.props.turn) ? () => this.useAction(this) : () => {}}>
                        <div className="c-action__cost">
                        <span>{this.state.extraTurnCost}</span>
                        </div>
                        <div className="c-action__info">
                            <span>🔄⏳</span>
                        </div>
                    </div>
                }
                {this.props.type === 'ghost-dices' && 
                    <div id="ghost-dices" className={(this.props.valknut >= this.state.ghostCost) ? "c-action" : "c-action--disabled"}
                    onClick={(this.props.valknut >= this.state.ghostCost) ? () => this.useAction(this) : () => {}}>
                        <div className="c-action__cost">
                        <span>{this.state.ghostCost}</span>
                        </div>
                        <div className="c-action__info">
                            <span>{this.props.i18n('gameAction.ghostDices')}</span>
                        </div>
                        <div className="c-action__book-wrap">
                            <div className="c-action__book-icon">
                                <Book />
                            </div>
                            <span>3</span>
                        </div>
                    </div>
                }
                {this.props.type === 'ghost-dices-mobile' && 
                    <div id="ghost-dices-mobile" className={(this.props.valknut >= this.state.ghostCost) ? "c-action-mobile" : "c-action-mobile--disabled"}
                    onClick={(this.props.valknut >= this.state.ghostCost) ? () => this.useAction(this) : () => {}}>
                        <div className="c-action__cost">
                        <span>{this.state.ghostCost}</span>
                        </div>
                        <div className="c-action__info">
                            <span>👻⏹️</span>
                        </div>
                    </div>
                }
                {this.props.type === 'green-dices' && 
                    <div id="green-dices" className={(this.props.valknut >= this.state.greenCost) ? "c-action" : "c-action--disabled"}
                    onClick={(this.props.valknut >= this.state.greenCost) ? () => this.useAction(this) : () => {}}>
                        <div className="c-action__cost">
                        <span>{this.state.greenCost}</span>
                        </div>
                        <div className="c-action__info">
                            <span>{this.props.i18n('gameAction.greenDices')}</span>
                        </div>
                        <div className="c-action__book-wrap">
                            <div className="c-action__book-icon">
                                <Book />
                            </div>
                            <span>1</span>
                        </div>
                    </div>
                }
                {this.props.type === 'green-dices-mobile' && 
                    <div id="green-dices-mobile" className={(this.props.valknut >= this.state.greenCost) ? "c-action-mobile" : "c-action-mobile--disabled"}
                    onClick={(this.props.valknut >= this.state.greenCost) ? () => this.useAction(this) : () => {}}>
                        <div className="c-action__cost">
                        <span>{this.state.greenCost}</span>
                        </div>
                        <div className="c-action__info">
                            <span>🟩⏹️</span>
                        </div>
                    </div>
                }
                {this.props.type === 'red-dices' && 
                    <div id="red-dices" className={(this.props.valknut >= this.state.redCost) ? "c-action" : "c-action--disabled"}
                    onClick={(this.props.valknut >= this.state.redCost) ? () => this.useAction(this) : () => {}}>
                        <div className="c-action__cost">
                        <span>{this.state.redCost}</span>
                        </div>
                        <div className="c-action__info">
                            <span>{this.props.i18n('gameAction.redDices')}</span>
                        </div>
                        <div className="c-action__book-wrap">
                            <div className="c-action__book-icon">
                                <Book />
                            </div>
                            <span>2</span>
                        </div>
                    </div>
                }
                {this.props.type === 'red-dices-mobile' && 
                    <div id="red-dices-mobile" className={(this.props.valknut >= this.state.redCost) ? "c-action-mobile" : "c-action-mobile--disabled"}
                    onClick={(this.props.valknut >= this.state.redCost) ? () => this.useAction(this) : () => {}}>
                        <div className="c-action__cost">
                        <span>{this.state.redCost}</span>
                        </div>
                        <div className="c-action__info">
                            <span>🟥⏹️</span>
                        </div>
                    </div>
                }
                {this.props.type === 'malediction' && 
                    <div id="malediction" className={(this.props.valknut >= this.state.maledictionCost) ? "c-action" : "c-action--disabled"}
                    onClick={(this.props.valknut >= this.state.maledictionCost) ? () => this.useAction(this) : () => {}}>
                        <div className="c-action__cost">
                        <span>{this.state.maledictionCost}</span>
                        </div>
                        <div className="c-action__info">
                            <span>{this.props.i18n('gameAction.malediction')}</span>
                        </div>
                        <div className="c-action__book-wrap">
                            <div className="c-action__book-icon">
                                <Book />
                            </div>
                            <span>2</span>
                        </div>
                    </div>
                }
                {this.props.type === 'malediction-mobile' && 
                    <div id="malediction-mobile" className={(this.props.valknut >= this.state.maledictionCost) ? "c-action-mobile" : "c-action-mobile--disabled"}
                    onClick={(this.props.valknut >= this.state.maledictionCost) ? () => this.useAction(this) : () => {}}>
                        <div className="c-action__cost">
                        <span>{this.state.maledictionCost}</span>
                        </div>
                        <div className="c-action__info">
                            <span>🥊</span>
                            <div className="c-action__info--icon">
                                <Malediction />
                            </div>
                        </div>
                    </div>
                }
                {this.props.type === 'clean-state' && 
                    <div id="clean-state" className={(this.props.valknut >= this.state.cleanCost) ? "c-action" : "c-action--disabled"}
                    onClick={(this.props.valknut >= this.state.cleanCost) ? () => this.useAction(this) : () => {}}>
                        <div className="c-action__cost">
                        <span>{this.state.cleanCost}</span>
                        </div>
                        <div className="c-action__info">
                            <span>{this.props.i18n('gameAction.cleanState')}</span>
                        </div>
                        <div className="c-action__book-wrap">
                            <div className="c-action__book-icon">
                                <Book />
                            </div>
                            <span>1</span>
                        </div>
                    </div>
                }
                {this.props.type === 'clean-state-mobile' && 
                    <div id="clean-state-mobile" className={(this.props.valknut >= this.state.cleanCost) ? "c-action-mobile" : "c-action-mobile--disabled"}
                    onClick={(this.props.valknut >= this.state.cleanCost) ? () => this.useAction(this) : () => {}}>
                        <div className="c-action__cost">
                        <span>{this.state.cleanCost}</span>
                        </div>
                        <div className="c-action__info">
                            <span>🧽✨</span>
                        </div>
                    </div>
                }
                {this.props.type === 'see-dices' && 
                    <div id="see-dices" className={(this.props.valknut >= this.state.seeCost) ? "c-action" : "c-action--disabled"}
                    onClick={(this.props.valknut >= this.state.seeCost) ? () => this.useAction(this) : () => {}}>
                        <div className="c-action__cost">
                        <span>{this.state.seeCost}</span>
                        </div>
                        <div className="c-action__info">
                            <span>{this.props.i18n('gameAction.seeDices')}</span>
                        </div>
                        <div className="c-action__book-wrap">
                            <div className="c-action__book-icon">
                                <Book />
                            </div>
                            <span>3</span>
                        </div>
                    </div>
                }
                {this.props.type === 'see-dices-mobile' && 
                    <div id="see-dices-mobile" className={(this.props.valknut >= this.state.seeCost) ? "c-action-mobile" : "c-action-mobile--disabled"}
                    onClick={(this.props.valknut >= this.state.seeCost) ? () => this.useAction(this) : () => {}}>
                        <div className="c-action__cost">
                        <span>{this.state.seeCost}</span>
                        </div>
                        <div className="c-action__info">
                            <span>👁️⏹️</span>
                        </div>
                    </div>
                }
                {/* ⏳🔄    🎖️🏅➕🤫🎣🧎🏻‍♂️    🥊🧨🪤🏴‍☠️  👻🟥🔲*/}
            </React.Fragment>
        );
    }
}