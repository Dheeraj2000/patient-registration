import { useEffect, useState } from "react";
import { getPatientDataServiceInstance } from "./patient-service";
import { Patient } from "@/types/patient";

export function usePatients() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const patientDataService = getPatientDataServiceInstance();
  
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        const results: Patient[] = await patientDataService.getAllPatients();
        setPatients(results);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Failed to load patients");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      const handleStorageChange = async() => {
        await fetchPatients();
      };
  
      window.addEventListener("patients-updated", handleStorageChange);
  
      const unsubscribe = patientDataService.addListener(fetchPatients);
  
      fetchPatients();
  
      return () => {
        window.removeEventListener("patients-updated", handleStorageChange);
        unsubscribe();
      };
    }, []);
    return { patients, loading, error, refetch: fetchPatients };
  }