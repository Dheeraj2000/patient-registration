export type Patient = {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    createdAt: string;
};

export type DbPatients = {
    rows: Patient[]
}
