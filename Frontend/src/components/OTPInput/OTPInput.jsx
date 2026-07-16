import { useEffect, useRef } from "react";

const OTPInput = ({ otp, setOtp }) => {
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    switch (e.key) {
      case "Backspace":
        if (otp[index] === "" && index > 0) {
          inputsRef.current[index - 1]?.focus();
        }
        break;

      case "ArrowLeft":
        if (index > 0) {
          inputsRef.current[index - 1]?.focus();
        }
        break;

      case "ArrowRight":
        if (index < 5) {
          inputsRef.current[index + 1]?.focus();
        }
        break;

      default:
        break;
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!paste) return;

    const newOtp = [...otp];

    paste.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    inputsRef.current[Math.min(paste.length, 5)]?.focus();
  };

  return (
    <div
      className="flex justify-between gap-3"
      onPaste={handlePaste}
    >
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) =>
            handleChange(e.target.value, index)
          }
          onKeyDown={(e) =>
            handleKeyDown(e, index)
          }
          className="
            w-14
            h-14
            rounded-xl
            border
            border-gray-300
            text-center
            text-2xl
            font-bold
            transition-all
            duration-200
            outline-none
            focus:border-emerald-500
            focus:ring-4
            focus:ring-emerald-200
          "
        />
      ))}
    </div>
  );
};

export default OTPInput;