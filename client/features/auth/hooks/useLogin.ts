import { useState } from "react";
import { Login } from "../models/auth";
import { useForm } from "react-hook-form";

export default function useLogin() {
  const [credentials, setCredentials] = useState();
  const { register, handleSubmit } = useForm();
  const updateCredentials = (e: Login) => {
    console.log("Form Submitted", e);
  };
  return { updateCredentials, handleSubmit, register };
}
