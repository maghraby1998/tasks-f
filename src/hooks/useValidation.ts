import ValidateAt from "../enums/ValidateAt";
import { validationSchema } from "../helpers/validations";
import { useState, useEffect } from "react";

interface Args {
  name: string;
  value: any;
  validateAt?: ValidateAt;
  isFormSubmitted: boolean;
  setClientErrors: (callBack: (arg: any) => any) => any;
}

const useValidation = ({
  name,
  value,
  validateAt,
  isFormSubmitted,
  setClientErrors,
}: Args) => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>("");

  const runValidation = async (): Promise<void> => {
    if (!validateAt) {
      return;
    }
    try {
      const valid = await validationSchema.validateAt(validateAt, {
        [validateAt]: value,
      });
      if (valid) {
        setIsValid(true);
        setValidationMessage("");
        setClientErrors((prev: any) =>
          prev.filter((inputName: any) => inputName !== name)
        );
      }
    } catch (error: any) {
      setIsValid(false);
      setValidationMessage(error.errors[0]);
      setClientErrors((prev: any[]) => {
        if (!prev.includes(name)) {
          return [...prev, name];
        } else {
          return prev;
        }
      });
    }
  };

  useEffect(() => {
    if (validateAt) {
      runValidation();
    }

    return () => {
      if (validateAt) {
        setIsValid(true);
        setValidationMessage("");
        setClientErrors((prev: any) =>
          prev.filter((inputName: any) => inputName !== name)
        );
      }
    };
  }, [value, isFormSubmitted]);

  return {
    isValid: validateAt ? isValid : true,
    validationMessage: validateAt ? validationMessage : "",
  };
};

export default useValidation;
