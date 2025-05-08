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
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                date_of_birth BIGINT NOT NULL,
                gender TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                address TEXT,
                created_at BIGINT NOT NULL,
                updated_at BIGINT NOT NULL,
                schema TEXT NOT NULL
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
              first_name,
              last_name,
              date_of_birth,
              gender,
              email,
              phone,
              address,
              created_at,
              updated_at,
              schema
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [
                    patient.id,
                    patient.first_name,
                    patient.last_name,
                    patient.date_of_birth,
                    patient.gender,
                    patient.email,
                    patient.phone,
                    patient.address,
                    patient.created_at,
                    patient.updated_at,
                    patient.schema
                ]
            );
            await this.db.query('COMMIT');
            console.log(`Patient ${patient.first_name} ${patient.last_name} inserted`);
        } catch (error) {
            console.error('Error inserting patient:', error);
            await this.db.query('ROLLBACK');
            throw error;
        }
    }

}