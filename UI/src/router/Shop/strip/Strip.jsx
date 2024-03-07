import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

const Strip = () => {
  const [loading, setLoading] = useState(false);
  const [stripe, setStripe] = useState(null);
  const [card, setCard] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_APP_BASE_API+`/api/v1/order/create-order/${cartId}`);
        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);

        const stripeInstance = await loadStripe("YOUR_PUBLISHABLE_KEY");
        setStripe(stripeInstance);

        const elements = stripeInstance.elements();
        const cardElement = elements.create("card");
        setCard(cardElement);

        cardElement.mount("#card-element");

        cardElement.on("change", (event) => {
          document.getElementById("submit").disabled = event.empty;
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchPaymentIntent();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: card,
      });

      if (error) {
        console.error(error);
        setLoading(false);
      } else {
        // Now you can send the payment method ID and clientSecret to your server
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

        if (result.error) {
          console.error(result.error);
          setLoading(false);
        } else {
          console.log("Payment confirmed successfully:", result.paymentIntent);
          // You can perform additional actions on successful payment confirmation
        }
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div id="card-element"></div>
      <button id="submit" type="submit" disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};


export default Strip;





