
import { Link } from "react-router-dom";
import { PatientList } from "@/components/patient-list";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Link
          to="/register"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Register New Patient
        </Link>
      </div>
      <PatientList />
    </div>
  );
}
