"use client";
import { useListPatients } from "./hooks/useListPatients";

export default function ListPatients() {
  const { patients } = useListPatients();
  return (
    <div>
      <h4>List Patients</h4>
      <ul>
        {patients.map((patient) => {
          return (
            <li key={patient.id}>
              {patient.firstName} {patient.lastName}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
