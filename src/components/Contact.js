import React, {useEffect} from 'react';
import { useTranslation } from "react-i18next"
import Form from "./Form"

export default function Contact() {
    const [t, i18n] = useTranslation("global")
    useEffect(() => {
        document.title = 'H2O Coatings - ' + t("contact")
        window.scrollTo(0, 0)
    }, [t]);

    return (
        <div className="c-contact">
            <h1 className="c-contact--title">{t("contact").toUpperCase()}</h1>
            <div className="c-contact--container">
                <div className="c-contact__presentation">
                    <img src="/viking-img.png" alt="warrior" className="c-contact__presentation--img"/>
                    <span>{t("contact-op.presentation")}</span>
                </div>
                <Form />
            </div>
        </div>
    );
}