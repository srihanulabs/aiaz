"use client";
import GridComponent from "@/features/components/grid/GridComponent";
import { ColumnDef } from "@/features/components/grid/models/grid";
import { Patient } from "@/features/models/Patients";
const patients: Patient[] = [
  {
    id: 1,
    firstName: "Aarav",
    lastName: "Sharma",
    email: "aarav.sharma@example.com",
    phoneNumber: "9876543210",
    countryCode: "+91",
    status: "active",
  },
  {
    id: 2,
    firstName: "Meera",
    lastName: "Iyer",
    email: "meera.iyer@example.com",
    phoneNumber: "9812345678",
    countryCode: "+91",
    status: "pending",
  },
  {
    id: 3,
    firstName: "Rohan",
    lastName: "Patel",
    email: "rohan.patel@example.com",
    phoneNumber: "9123456780",
    countryCode: "+91",
    status: "suspended",
  },
];

const patientColumns: ColumnDef<Patient>[] = [
  { id: "firstName", header: "First Name", accessor: (row) => row.firstName },
  { id: "lastName", header: "Last Name", accessor: (row) => row.lastName },
  // email, phone, status — yours
];

export default function Demo() {
  return (
    <GridComponent
      rows={patients}
      columns={patientColumns}
      getRowId={(row) => row.id}
    />
  );
}
