import { DbPatients, Patient } from "@/types/patient";
import { PGlite } from "@electric-sql/pglite";

export class PatientDataSaveService {

    private db: PGlite & Record<string, never>
    constructor() {
    }

    async init() {
        await new Promise(resolve => setTimeout(resolve, 100));
        this.db = await this.createDb();
    }

    async createDb() {
        try {
            console.log('Initializing database...');
            const db = await PGlite.create({ dataDir: 'idb://patients.db' });
            await db.exec(`
              CREATE TABLE IF NOT EXISTS patients (
                id TEXT PRIMARY KEY,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                dateOfBirth TEXT NOT NULL,
                gender TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                address TEXT,
                createdAt TEXT NOT NULL
              );
            `);

            console.log('Database initialized successfully');
            return db;
        } catch (error) {
            console.error('Error initializing database:', error);
            throw error;
        }
    }

    async getAllPatientsFromDb(): Promise<Patient[]> {
        const result: DbPatients = await this.db.query('SELECT * FROM patients ORDER BY createdAt DESC');
        console.log("*************************Rows", result.rows);
        return result.rows;
    }

    async queryDb(sql: string) {
        const result = await this.db.query(sql);
        return result.rows;
    }

    async savePatient(patient: Patient) {
        try {
            await this.db.query(
                `INSERT INTO patients (
              id,
              firstName,
              lastName,
              dateOfBirth,
              gender,
              email,
              phone,
              address,
              createdAt
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                    patient.id,
                    patient.firstName,
                    patient.lastName,
                    patient.dateOfBirth,
                    patient.gender,
                    patient.email,
                    patient.phone,
                    patient.address,
                    patient.createdAt
                ]
            );
            console.log(`Patient ${patient.firstName} ${patient.lastName} inserted`);
        } catch (error) {
            console.error('Error inserting patient:', error);
            throw error;
        }
    }

}