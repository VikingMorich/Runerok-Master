import React from "react";
import { useTranslation } from "react-i18next";


export default function PayBeer() {
  const [t] = useTranslation("global");


  

  return (
    <div className="c-pay-beer">
      <h1 className="c-pay-beer--title">{t("payBeer.title").toUpperCase()}</h1>
      <div className="pay-button-wrapper">
      </div>
      <div className="c-pay-beer__footer">
        <span>{t("contact-op.footer")}</span>
      </div>
    </div>
  );
}
