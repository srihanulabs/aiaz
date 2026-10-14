import { useEffect, useState } from "react";
import { Patient, PatientList } from "../models/Patient";
import { httpGet } from "@/utils/httpClient";
import { z } from "zod";

export const useListPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  useEffect(() => {
    httpGet("patients").then((res) => {
      console.log("==> ", res.data);
      console.log("==> ", res.data, PatientList.parse(res.data));
      setPatients(res.data);
    });
  }, []);
  return { patients };
};
