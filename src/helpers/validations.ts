import { number, object, string } from "yup";

export const validationSchema = object({
  isString: string().required("this field is required"),
  isNumber: number().required("this field is required").positive().integer(),
  isEmail: string()
    .required("this field is required")
    .email("should be a valid email"),
});
