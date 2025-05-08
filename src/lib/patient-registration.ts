import { Patient } from "@/types/patient";
import { getPatientDataServiceInstance } from "./patient-service";

export const registerPatient = async (patient: Omit<Patient, 'id' | 'created_at' | 'updated_at' | 'schema'>) => {
    const patientDataService = getPatientDataServiceInstance();
    const id = crypto.randomUUID();
    const dateOfBirthNumber: number = new Date(patient.date_of_birth).getTime();
    patient.date_of_birth = dateOfBirthNumber;
    const created_at = Date.now();
    const updated_at = Date.now();
    const schema = "Patient_1_0";
    const newPatient: Patient = {
      id,
      ...patient,
      created_at,
      updated_at,
      schema
    };
    return await patientDataService.addPatient(newPatient);
};