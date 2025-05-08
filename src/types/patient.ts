export type Patient = {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: number;
    gender: string;
    email: string;
    phone: string;
    address: string;
    updated_at: number;
    created_at: number;
    schema: "Patient_1_0"
};

export type DbPatients = {
    rows: Patient[]
}
