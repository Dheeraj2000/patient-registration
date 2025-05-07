import { Patient } from "@/types/patient";
import { getPatientDataServiceInstance } from "./patient-service";

export const registerPatient = async (patient: Omit<Patient, 'id' | 'createdAt'>) => {
    const patientDataService = getPatientDataServiceInstance();
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const newPatient = {
      id,
      ...patient,
      createdAt,
    };
    return await patientDataService.addPatient(newPatient);
};