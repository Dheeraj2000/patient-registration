
import { PatientRegistrationForm } from "@/components/patient-registration-form";

export default function Register() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Register New Patient</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <PatientRegistrationForm />
      </div>
    </div>
  );
}
