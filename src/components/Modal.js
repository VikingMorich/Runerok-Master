import React from 'react';
import cross from '../icons/clear-black-18dp.svg'
import { useTranslation } from "react-i18next"
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import 'react-awesome-slider/dist/custom-animations/cube-animation.css';

export default function Modal(props) {
    const [t] = useTranslation("global")
    
    return (
        <React.Fragment>
            {props.open &&
            <div className="c-modal-background">
                <div className="c-modal">
                    <img className="c-modal--cross" alt="menu-icon" src={cross} onClick={props.toggleModal}/>
                    {props.type === 'history' && 
                        <React.Fragment>
                            <div className="c-modal-background__container">
                                <video autoPlay muted loop className="modal-background-video">
                                    <source src="/stockfootage0738.mp4" type="video/mp4" />
                                </video>
                            </div>
                            <img src="/runerok.png" alt="Runerok" className='fadeIn c-modal--logo'/>
                            <div className="c-modal__history--content">
                                <span>{t('modal.p1')}</span>
                            </div>
                        </React.Fragment>
                    }
                    {props.type === 'instructions' &&
                        <React.Fragment>
                            <AwesomeSlider animation="cubeAnimation" className="c-slider">
                                <div className="c-slider__text">
                                    <p>{t('instructions.p1')}</p>
                                    <p>{t('instructions.p2')}</p>
                                    <p>{t('instructions.p3')}</p>
                                    <p>{t('instructions.p4')}</p>
                                </div>
                                <div className="c-slider__text">
                                    <p>{t('instructions.p5')}</p>
                                    <p>{t('instructions.p6')}</p>
                                    <p>{t('instructions.p7')}</p>
                                    <p>{t('instructions.p8')}</p>
                                </div>
                                <div className="c-slider__text">
                                    <p>{t('instructions.p9')}</p>
                                    <p>{t('instructions.p10')}</p>
                                    <p>{t('instructions.p11')}</p>
                                    <p>{t('instructions.p12')}</p>
                                </div>
                                <div className="c-slider__text">
                                    <p>{t('instructions.p13')}</p>
                                    <p>{t('instructions.p14')}</p>
                                    <p>{t('instructions.p15')}</p>
                                </div>
                            </AwesomeSlider>
                        </React.Fragment>
                    }
                    {props.type === 'privacy' && 
                        <React.Fragment>
                            <div className="c-modal--content">
                                <h1>{t('privacy.title')}</h1>
                                <p>{t('privacy.p1')}</p>
                                <h3>{t('privacy.h1')}</h3>
                                <p>{t('privacy.p2')}</p>
                                <h3>{t('privacy.h2')}</h3>
                                <p>{t('privacy.p3')}</p>
                                <h3>{t('privacy.h3')}</h3>
                                <p>{t('privacy.p4')}</p>
                                <h3>{t('privacy.h4')}</h3>
                                <p>{t('privacy.p5')}</p>
                            </div>
                        </React.Fragment>
                    }
                </div>
            </div>
            }
        </React.Fragment>
    );
}