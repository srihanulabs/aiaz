import { httpGet, httpPost } from "@/utils/httpClient";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PatientSchema, type Patient } from "../models/Patient";
import { zodResolver } from "@hookform/resolvers/zod";

export default function useAddPatient() {
  const [patientSaved, setPatientSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(PatientSchema),
  });

  useEffect(() => {
    const result = httpGet("users");
    result.then((res) => console.log(res));
  }, [patientSaved]);

  const patientRegisterFormHandler = (formData: Patient) => {
    httpPost("patients", formData).then((res) => {
      console.log(res);
      setPatientSaved(true);
    });
  };

  return {
    register,
    handleSubmit,
    patientRegisterFormHandler,
    errors,
    isSubmitting,
  };
}
