import React, { useState } from "react";
import { login } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import TextInput from "../../inputs/TextInput";
import ValidateAt from "../../enums/ValidateAt";
import { useMutation } from "@apollo/client";
import { SIGNUP } from "../../graphql/mutations";
import Swal from "sweetalert2";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { NavLink } from "react-router-dom";

const SignUp: React.FC = () => {
  const dispatch = useDispatch();

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [clientErrors, setClientErrors] = useState<string[]>([]);

  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const [formInput, setFormInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [attemptSignUp] = useMutation(SIGNUP, {
    variables: {
      input: {
        name: formInput.name,
        email: formInput.email,
        password: formInput.password,
      },
    },
    onCompleted: (data) => {
      dispatch(
        login({
          access_token: data?.signUp?.access_token,
          user: data?.signUp?.user,
        })
      );
    },
    onError: (error) => {
      Swal.fire(error?.graphQLErrors?.[0]?.message ?? "Something went wrong");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsFormSubmitted(true);

    if (clientErrors.length) return;

    attemptSignUp();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center min-h-screen">
      <img
        src="/src/assets/login-background.jpg"
        className="w-full"
        alt="login-image"
      />
      <div className="h-[calc(70vh)] w-[2px] bg-slate-800"></div>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center"
      >
        <FontAwesomeIcon
          icon={faListCheck}
          size="2x"
          className="mb-3 h-[30px] w-[30px] bg-slate-500 p-3 rounded-full text-white"
        />
        <h2 className="text-2xl text-center capitalize text-gray-800 font-semibold">
          hello again!
        </h2>
        <p className="mb-5 text-gray-500">Welcome back to our website</p>

        <TextInput
          placeholder="Name"
          name="name"
          value={formInput.name}
          onChange={handleInputChange}
          validateAt={ValidateAt.isString}
          isFormSubmitted={isFormSubmitted}
          setClientErrors={setClientErrors}
          containerStyle="w-[55%] mb-3"
        />

        <TextInput
          placeholder="Email"
          name="email"
          value={formInput.email}
          onChange={handleInputChange}
          validateAt={ValidateAt.isString}
          isFormSubmitted={isFormSubmitted}
          setClientErrors={setClientErrors}
          containerStyle="w-[55%] mb-3"
        />

        <TextInput
          placeholder="Password"
          name="password"
          value={formInput.password}
          onChange={handleInputChange}
          validateAt={ValidateAt.isString}
          isFormSubmitted={isFormSubmitted}
          setClientErrors={setClientErrors}
          containerStyle="w-[55%] mb-3"
          type={isPasswordShown ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={() => setIsPasswordShown((prev) => !prev)}>
                  {isPasswordShown ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <motion.div whileTap={{ scale: 0.8 }}>
          <button
            className="text-center bg-slate-500 text-white h-[35px] w-[100px] rounded mt-3 capitalize font-semibold"
            type="submit"
          >
            sign up
          </button>
        </motion.div>

        <div className="flex items-center justify-center gap-2 mt-3">
          <p className="font-semibold capitalize">already have an account ?</p>
          <NavLink to={"/login"} className={"text-blue-500 font-semibold"}>
            login
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
