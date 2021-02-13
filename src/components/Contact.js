import React, {useEffect} from 'react';
import { useTranslation } from "react-i18next"
import Form from "./Form"

export default function Contact() {
    const [t, i18n] = useTranslation("global")

    return (
        <div className="c-contact">
            <h1 className="c-contact--title">{t("contact").toUpperCase()}</h1>
            <div className="c-contact--container">
                <div className="c-contact__presentation">
                    <img src="/viking-img.png" alt="warrior" className="c-contact__presentation--img"/>
                    <div>
                        <p>{t("contact-op.presentation")}</p>
                        <p>{t("contact-op.presentation-end")}</p>
                    </div>
                </div>
                <Form />
            </div>
            <div className="c-contact__footer">
                <span>{t("contact-op.footer")}</span>
            </div>
        </div>
    );
}