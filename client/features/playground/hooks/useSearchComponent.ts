import { httpGet } from "@/utils/httpClient";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientSchema, type Patient } from "../models/Patient";

export default function useSearchComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  return {};
}
