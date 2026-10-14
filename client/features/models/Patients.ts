type PatientStatus = "active" | "pending" | "suspended";
export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  status: PatientStatus;
}
