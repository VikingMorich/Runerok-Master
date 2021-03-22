import React from 'react';
import { useTranslation } from "react-i18next"

export default function Error404() {
    const [t] = useTranslation("global")
    
    return (
        <div className="c-contact">
            <div className="c-not-found">
                <h3>{t("error404.title")}</h3>
                <h4>{t("error404.subtitle")}</h4>
            </div>
        </div>
    );
}