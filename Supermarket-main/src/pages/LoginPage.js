import { Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FormProvider, FTextField } from "../components/form";
import { useAuth } from "../contexts/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

// Validation Schema
const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

// Default Values
const defaultValues = {
  username: "",
  password: "",
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    const from = location.state?.from?.pathname || "/";
    const { username, password } = data;

    // Attempt login via auth context
    const error = await auth.login(username, password, () => {
      console.log("Login successful, navigating to:", from);
      navigate(from, { replace: true });
    });
    if (error) {
      setErrorMessage(error);
    }
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ minWidth: "350px" }}>
        <Typography variant="h4" textAlign="center">
          Login
        </Typography>

        <FTextField name="username" label="Username" />
        <FTextField name="password" label="Password" type="password" />
        {errorMessage && (
          <Typography color="error" variant="body2" textAlign="center">
            Invalid username or password
          </Typography>
        )}
        <Button type="submit" variant="contained">
          Login
        </Button>

        <Typography variant="body2" textAlign="center">
          Don&apos;t have an account?
        </Typography>
        <Button variant="outlined" onClick={handleSignUpClick}>
          Sign Up
        </Button>
      </Stack>
    </FormProvider>
  );
}

export default LoginPage;
