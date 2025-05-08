
import { Skeleton } from "@/components/ui/skeleton";
import { usePatients } from "@/lib/patient-list";
import { Patient } from "@/types/patient";

export function PatientList() {
  const { patients, loading, error } = usePatients();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border rounded-md p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-[80%]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">{error}</p>
        <button
          className="mt-2 px-4 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 border rounded-md">
        <p className="text-gray-500">No patients registered yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {patients.map((patient: Patient) => (
        <div key={patient.id} className="border rounded-md p-4 hover:bg-gray-50">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium text-lg">
                {patient.first_name} {patient.last_name}
              </h3>
              <p className="text-sm text-gray-500">
                DOB: {new Date(patient.date_of_birth).toLocaleDateString()} | {patient.gender}
              </p>
              {patient.email && <p className="text-sm">Email: {patient.email}</p>}
              {patient.phone && <p className="text-sm">Phone: {patient.phone}</p>}
            </div>
          </div>
          {patient.address && (
            <div className="mt-2 text-sm">
              <p className="text-gray-500">Address: {patient.address}</p>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-400">
            Registered on: {new Date(patient.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
