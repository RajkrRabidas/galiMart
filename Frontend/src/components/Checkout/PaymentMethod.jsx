import { useState } from "react";

const PaymentMethod = () => {

  const [payment, setPayment] = useState("cod");

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mt-8">

      <h2 className="text-xl font-bold mb-5">
        Payment Method
      </h2>

      <div className="space-y-4">

        <label className="flex items-center gap-3 cursor-pointer">

          <input
            type="radio"
            checked={payment === "cod"}
            onChange={() => setPayment("cod")}
          />

          Cash On Delivery

        </label>

        <label className="flex items-center gap-3 cursor-pointer">

          <input
            type="radio"
            checked={payment === "upi"}
            onChange={() => setPayment("upi")}
          />

          UPI

        </label>

        <label className="flex items-center gap-3 cursor-pointer">

          <input
            type="radio"
            checked={payment === "card"}
            onChange={() => setPayment("card")}
          />

          Debit / Credit Card

        </label>

      </div>

    </div>
  );
};

export default PaymentMethod;