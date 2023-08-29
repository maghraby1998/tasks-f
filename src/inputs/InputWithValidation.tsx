import React from "react";
import useValidation from "../hooks/useValidation";
import ValidateAt from "../enums/ValidateAt";

interface Props {
  name: string;
  value: string;
  label?: string;
  validateAt?: ValidateAt;
  isFormSubmitted?: boolean;
  setClientErrors?: (callback: (arg: any) => any) => any;
  containerStyle?: string;
  children: React.ReactNode;
  inputId: string;
}

const InputWithValidation: React.FC<Props> = ({
  validateAt,
  isFormSubmitted = false,
  setClientErrors = () => {},
  label,
  containerStyle,
  children,
  inputId,
  name,
  value,
}) => {
  const { isValid, validationMessage } = useValidation({
    name: name,
    value: value,
    validateAt,
    isFormSubmitted,
    setClientErrors,
  });

  return (
    <div className={`flex flex-col justify-end ${containerStyle}`}>
      <div>
        {label?.length ? (
          <label
            className={`capitalize font-semibold ${
              !isValid && isFormSubmitted ? "text-red-400" : "text-slate-500 "
            }`}
            htmlFor={inputId}
          >
            {label}
          </label>
        ) : null}
        <div
          className={
            !isValid && isFormSubmitted
              ? "invalid-input-style"
              : //   : "border-b border-b-slate-500"
                ""
          }
        >
          {children}
        </div>
      </div>
      {isFormSubmitted ? (
        <p className="error-validation-message">{validationMessage}</p>
      ) : null}
    </div>
  );
};

export default InputWithValidation;
