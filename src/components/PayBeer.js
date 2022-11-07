import React from "react";
import { useTranslation } from "react-i18next";
import GooglePayButton from "@google-pay/button-react";

export default function PayBeer() {
  const [t] = useTranslation("global");

  const paymentRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
          allowedCardNetworks: ["MASTERCARD", "VISA"],
        },
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          parameters: {
            gateway: "example",
            gatewayMerchantId: "exampleGatewayMerchantId",
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: "BCR2DN4T2TPLBEQ4",
      merchantName: "Runerok",
    },
    transactionInfo: {
      totalPriceStatus: "FINAL",
      totalPriceLabel: "Total",
      totalPrice: "0.01",
      currencyCode: "EUR",
      countryCode: "ES",
    },
  };

  function handleLoadPaymentData(paymentData) {
    console.log("load payment data", paymentData);
  }
  

  return (
    <div className="c-pay-beer">
      <h1 className="c-pay-beer--title">{t("payBeer.title").toUpperCase()}</h1>
      <div className="pay-button-wrapper">
        <GooglePayButton
          buttonColor="white"
          paymentRequest={paymentRequest}
          onLoadPaymentData={handleLoadPaymentData}
        />
      </div>
      <div className="c-pay-beer__footer">
        <span>{t("contact-op.footer")}</span>
      </div>
    </div>
  );
}
