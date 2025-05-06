import { Patient } from "@/types/patient";
import { PatientDataSaveService } from "./data-save-service";


class PatientDataService {
  private patients: Patient[] = [];
  private initialized = false;
  private storageKey = "patient-database";
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: (() => void)[] = [];
  private dataSaveService: PatientDataSaveService
  private isSaving = false;

  constructor() {
    this.dataSaveService = new PatientDataSaveService();
    this.setupBroadcastChannel();
  }


  private setupBroadcastChannel() {
    try {
      this.broadcastChannel = new BroadcastChannel('patient-database-channel');
      this.broadcastChannel.onmessage = async (event) => {
        if (event.data.type === 'update') {
          await this.loadFromStorage(false);
          this.notifyListeners();
        }
      };
    } catch (error) {
      console.error("BroadcastChannel not supported:", error);
      this.setupStorageFallback();
    }
  }

  private setupStorageFallback() {
    window.addEventListener('storage', async (event) => {
      if (event.key === this.storageKey) {
        await this.loadFromStorage(false);
        this.notifyListeners();
      }
    });
  }

  async init() {
    if (this.initialized) {
      return;
    }
    await this.dataSaveService.init();
    await this.loadFromStorage();
    this.initialized = true;
  }

  async addPatient(patient: Patient): Promise<Patient> {
    this.patients.push(patient);
    await this.saveToStorage(patient);
    return patient;
  }

  private notifyListeners() {
    this.listeners.forEach(async (listener) => await listener());
  }

  public addListener(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private async loadFromStorage(broadcast = true): Promise<void> {
    try {
      this.patients = await this.dataSaveService.getAllPatientsFromDb();
      this.initialized = true;
      if (broadcast) {
        this.broadcastUpdate();
      }
      this.notifyListeners();
      const event = new CustomEvent("patients-updated", { // doubt
        detail: { timestamp: new Date().getTime() }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error loading data from storage:", error);
      this.initialized = true;
    }
  }

  private async saveToStorage(newPatient: Patient): Promise<void> {
    if (this.isSaving) {
      console.warn("pls save again")
      return;
    }
    this.isSaving = true;
    try {
      await this.dataSaveService.savePatient(newPatient);
      const abc = await this.dataSaveService.getAllPatientsFromDb();
      console.log("**************************abc", abc)
      this.broadcastUpdate();
      const event = new CustomEvent("patients-updated", {
        detail: { timestamp: new Date().getTime() }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error saving data to storage:", error);
    } finally {
      this.isSaving = false;
    }
  }

  private broadcastUpdate(): void {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'update', timestamp: Date.now() });
    }
    localStorage.setItem(this.storageKey, Date.now().toString());
  }

  public getAllPatients(): Patient[] {
    return [...this.patients];
  }

  async executeQuery(sql: string): Promise<any[]> {
    try {
      const result = await this.dataSaveService.queryDb(sql);
      return result;
    } catch (error) {
      console.error('Query execution failed:', error);
      throw new Error('Invalid SQL query. Only safe SELECT statements are supported.');
    }
  }

  // Cleanup resources when done
  destroy() {
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
  }
}

// Singleton instance
const patientDataService = new PatientDataService();

export function getPatientDataServiceInstance(): PatientDataService {
  return patientDataService;
}

// Initialize the database
export const initDb = async () => {
  return await patientDataService.init();
};

