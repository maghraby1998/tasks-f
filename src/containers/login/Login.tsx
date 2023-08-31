import React, { useState } from "react";
import { login } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import TextInput from "../../inputs/TextInput";
import ValidateAt from "../../enums/ValidateAt";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../graphql/mutations";
import Swal from "sweetalert2";
import { IconButton, InputAdornment } from "@mui/material";
import { AccountCircle, Visibility, VisibilityOff } from "@mui/icons-material";

const Login: React.FC = () => {
  const dispatch = useDispatch();

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [clientErrors, setClientErrors] = useState<string[]>([]);

  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const [formInput, setFormInput] = useState({ email: "", password: "" });

  const [attemptLogin, { loading: loginLoading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      dispatch(
        login({
          access_token: data?.signIn?.access_token,
          user: data?.signIn?.user,
        })
      );
    },
    onError: (error) => {
      console.log(error.graphQLErrors[0]);
      Swal.fire(error?.graphQLErrors?.[0]?.message ?? "Something went wrong");
    },
  });

  const handleLogin = () => {
    setIsFormSubmitted(true);

    if (!clientErrors.length) {
      attemptLogin({
        variables: {
          email: formInput.email,
          password: formInput.password,
        },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
            onClick={handleLogin}
            className="text-center bg-slate-500 text-white h-[35px] w-[100px] rounded mt-3 capitalize font-semibold"
          >
            login
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default Login;
