import { AddPatient } from "./AddPatient";
import ListPatients from "./ListPatients";

export default function SearchComponent() {
  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div>
        <h2 className="text-xl text-blue-600 my-5">
          Patient Registration Form
          <AddPatient />
          <ListPatients />
        </h2>
      </div>
    </div>
  );
}
