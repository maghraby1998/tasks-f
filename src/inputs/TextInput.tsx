import React from "react";
import ValidateAt from "../enums/ValidateAt";
import InputWithValidation from "./InputWithValidation";
import { TextField } from "@mui/material";
import useValidation from "../hooks/useValidation";

interface Props {
  name: string;
  value: string;
  onChange?: (e: any) => void;
  label?: string;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  validateAt?: ValidateAt;
  isFormSubmitted?: boolean;
  setClientErrors?: (callback: (arg: any) => any) => any;
  containerStyle?: string;
  autoFocus?: boolean;
  setFormData?: (callback: (arg: any) => any) => any;
}

const randomId = String(Math.random() * 999999999);

const TextInput: React.FC<Props> = ({
  onChange,
  type,
  disabled,
  placeholder,
  autoFocus,
  setFormData,
  ...props
}) => {
  const { isValid, validationMessage } = useValidation({
    name: props.name,
    value: props.value,
    validateAt: props.validateAt,
    isFormSubmitted: props.isFormSubmitted ? props.isFormSubmitted : false,
    setClientErrors: props.setClientErrors ? props.setClientErrors : () => {},
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (!setFormData) return;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <div className={props.containerStyle}>
      <TextField
        id="outlined-basic"
        label={placeholder}
        variant="outlined"
        name={props.name}
        value={props.value}
        onChange={onChange ? onChange : handleInputChange}
        className="w-full outline-none border border-1 border-black block px-2 rounded"
        autoFocus={autoFocus}
        disabled={disabled}
        error={!isValid && props.isFormSubmitted}
      />

      {props.isFormSubmitted ? (
        <p className="error-validation-message">{validationMessage}</p>
      ) : null}
    </div>
  );
};

export default TextInput;
