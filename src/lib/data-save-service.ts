import { DbPatients, Patient } from "@/types/patient";
import { PGliteWorker } from '@electric-sql/pglite/worker';


export class PatientDataSaveService {

    private db: PGliteWorker
    private isInitialized = false;

    constructor() {
    }

    async init() {
        await new Promise(resolve => setTimeout(resolve, 100));
        this.db = await this.createDb();
        this.isInitialized = true;
    }

    async createDb() {
        try {
            console.log('Initializing database...');
            const worker = new Worker(new URL('./pglite-worker.ts', import.meta.url), {
                type: 'module',
            });
            const db = new PGliteWorker(worker);
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
        try {    
            const result: DbPatients = await this.db.query('SELECT * FROM patients');
            return result.rows;
        } catch (error) {
          console.error("Database query failed:", error);
          throw error;
        }
    }

    async queryDb(sql: string) {
        const result = await this.db.query(sql);
        return result.rows;
    }

    async savePatient(patient: Patient) {
        if (!this.isInitialized) {
            await this.init();
        }
        try {
            await this.db.query('BEGIN');
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
            await this.db.query('COMMIT');
            console.log(`Patient ${patient.firstName} ${patient.lastName} inserted`);
        } catch (error) {
            console.error('Error inserting patient:', error);
            await this.db.query('ROLLBACK');
            throw error;
        }
    }

}