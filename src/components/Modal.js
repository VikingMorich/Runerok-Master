import React from 'react';
import cross from '../icons/clear-black-18dp.svg'
import { useTranslation } from "react-i18next"
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import 'react-awesome-slider/dist/custom-animations/cube-animation.css';
import { Ship, Valknut, Rune, Heart, Damage, Helmet, Shield, Ham, Beer, Critical, Horn} from './icon/icon'


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
                                    <h3><u>{t('header.instructions').toUpperCase() + ' - STANDART'}</u></h3>
                                    <p>
                                        {t('instructions-ok.p1')}
                                        <div className="c-modal__instructions--icon">
                                            <Rune></Rune>
                                        </div>
                                        {t('instructions-ok.p1-2')}
                                    </p>
                                    <p>
                                        {t('instructions-ok.p2')}
                                        <div className="c-modal__instructions--icon">
                                            <Heart></Heart>
                                        </div>
                                    </p>
                                    <p>{t('instructions-ok.p3')}</p>
                                    <p>{t('instructions-ok.p4')}</p>
                                </div>
                                <div className="c-slider__text">
                                    <h3><u>{t('instructions-ok.dices')}</u></h3>
                                    <div className="wrap">
                                        <div className="cube">
                                            <div className="front background-green">
                                                <Rune></Rune>
                                            </div>
                                            <div className="back background-green">
                                                <Damage></Damage>
                                            </div>
                                            <div className="top background-green">
                                                <Valknut></Valknut>
                                            </div>
                                            <div className="bottom background-green">
                                                <Ship></Ship>
                                            </div>
                                            <div className="left background-green">
                                                <Rune></Rune>
                                            </div>
                                            <div className="right background-green">
                                                <Rune></Rune>
                                            </div>
                                        </div>
                                        <div className="cube">
                                            <div className="front background-yellow">
                                                <Rune></Rune>
                                            </div>
                                            <div className="back background-yellow">
                                                <Damage></Damage>
                                            </div>
                                            <div className="top background-yellow">
                                                <Valknut></Valknut>
                                            </div>
                                            <div className="bottom background-yellow">
                                                <Ship></Ship>
                                            </div>
                                            <div className="left background-yellow">
                                                <Rune></Rune>
                                            </div>
                                            <div className="right background-yellow">
                                                <Damage></Damage>
                                            </div>
                                        </div>
                                        <div className="cube">
                                            <div className="front background-red">
                                                <Damage></Damage>
                                            </div>
                                            <div className="back background-red">
                                                <Damage></Damage>
                                            </div>
                                            <div className="top background-red">
                                                <Valknut></Valknut>
                                            </div>
                                            <div className="bottom background-red">
                                                <Ship></Ship>
                                            </div>
                                            <div className="left background-red">
                                                <Damage></Damage>
                                            </div>
                                            <div className="right background-red">
                                                <Rune></Rune>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="c-modal__dices">
                                        <span>{t('instructions-ok.dificult')}</span>
                                        <div className="c-modal__dice c-modal__dice--green"></div>
                                        <span>{t('instructions-ok.easy')}</span>
                                        <div className="c-modal__dice c-modal__dice--yellow"></div>
                                        <span>{t('instructions-ok.medium')}</span>
                                        <div className="c-modal__dice c-modal__dice--red"></div>
                                        <span>{t('instructions-ok.hard')}</span>
                                    </div>
                                    <div className="c-slider__text--span c-slider__text--first">
                                        <div className="c-modal__instructions--icon">
                                            <Rune></Rune>
                                        </div>
                                        <p>{t('instructions-ok.colon')}
                                        {t('instructions-ok.p5')}</p>
                                        <span>{t('instructions-ok.p5-2')}</span>
                                    </div>
                                    <div className="c-slider__text--span">
                                        <div className="c-modal__instructions--icon">
                                            <Damage></Damage>
                                        </div>
                                        <p>{t('instructions-ok.colon')}
                                        {t('instructions-ok.p6')}</p>
                                    </div>
                                    <div className="c-slider__text--span">
                                        <div className="c-modal__instructions--icon">
                                            <Ship></Ship>
                                        </div>
                                        <p>{t('instructions-ok.colon')}
                                        {t('instructions-ok.p7')}</p>
                                        <span>{t('instructions-ok.p7-2')}</span>
                                    </div>
                                    <div className="c-slider__text--span">
                                        <div className="c-modal__instructions--icon">
                                            <Valknut></Valknut>
                                        </div>
                                        <p>{t('instructions-ok.colon')}
                                        {t('instructions-ok.p8')}</p>
                                    </div>
                                </div>
                                <div className="c-slider__text">
                                    <p>{t('instructions-ok.p9')}</p>
                                    <p>{t('instructions-ok.p10')}</p>
                                    <p>
                                        {t('instructions-ok.p11')}
                                        <div className="c-modal__instructions--icon">
                                            <Valknut></Valknut>
                                        </div>
                                        {t('instructions-ok.p11-2')}
                                    </p>
                                    <p>{t('instructions-ok.p12')}</p>
                                </div>
                                <div className="c-slider__text">
                                    <p>{t('instructions-ok.p13')}</p>
                                    <p>{t('instructions-ok.p14')}</p>
                                    <p>{t('instructions-ok.p15')}</p>
                                    <p>{t('instructions-ok.p16')}</p>
                                </div>
                                <div className="c-slider__text">
                                    <h3><u>{t('instructions-ok.t1')}</u></h3>
                                    <div className="wrap wrap-extra-bottom">
                                        <div className="cube">
                                            <div className="front background-blue">
                                                <Shield />
                                            </div>
                                            <div className="back background-blue">
                                                <Helmet />
                                            </div>
                                            <div className="top background-blue">
                                                <Damage />
                                            </div>
                                            <div className="bottom background-blue">
                                                <Damage />
                                            </div>
                                            <div className="left background-blue">
                                                <Valknut />
                                            </div>
                                            <div className="right background-blue">
                                                <Ship />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="c-slider__text--span">
                                        <div className="c-modal__instructions--icon">
                                            <Helmet />
                                        </div>
                                        <p>{t('instructions-ok.colon')}
                                        {t('instructions-ok.p17')}</p>
                                    </div>
                                    <div className="c-slider__text--span">
                                        <div className="c-modal__instructions--icon">
                                            <Shield />
                                        </div>
                                        <p>{t('instructions-ok.colon')}
                                        {t('instructions-ok.p18')}</p>
                                    </div>
                                    <div className="c-slider__text--span">
                                        <p>{t('instructions-ok.p18-2')}</p>
                                    </div>
                                </div>
                                <div className="c-slider__text">
                                    <div className="wrap wrap-extra-bottom">
                                        <div className="cube">
                                            <div className="front background-purple">
                                                <Horn />
                                            </div>
                                            <div className="back background-purple">
                                                <Ham />
                                            </div>
                                            <div className="top background-purple">
                                                <Beer />
                                            </div>
                                            <div className="bottom background-purple">
                                                <Damage />
                                            </div>
                                            <div className="left background-purple">
                                                <Critical />
                                            </div>
                                            <div className="right background-purple">
                                                <Critical />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="c-slider__text--span">
                                        <div className="c-modal__instructions--icon">
                                            <Horn />
                                        </div>
                                        <p>{t('instructions-ok.colon')}
                                        {t('instructions-ok.p19')}</p>
                                    </div>
                                    <div className="c-slider__text--span">
                                        <div className="c-modal__instructions--icon">
                                            <Beer />
                                        </div>
                                        <p>{t('instructions-ok.colon')}
                                        {t('instructions-ok.p20')}</p>
                                    </div>
                                    <div className="c-slider__text--span">
                                        <div className="c-modal__instructions--icon">
                                            <Ham />
                                        </div>
                                        <p>{t('instructions-ok.colon')}
                                        {t('instructions-ok.p21')}</p>
                                    </div>
                                    <div className="c-slider__text--span">
                                        <div className="c-modal__instructions--icon">
                                            <Critical />
                                        </div>
                                        <p>{t('instructions-ok.colon')}
                                        {t('instructions-ok.p22')}</p>
                                    </div>
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