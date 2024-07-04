    export interface Exams{
        id: number;
        name: string;
        examType: string;
        fileId: number;
        doctorId: number;
        patientId: number;
        examDate: string;
        createdAt: string;
    }

    export interface ExamsList{
        patientId: number;
        doctorId: number;
        name: string;
        fileId: number;
        examDate: string;
        examType: string;
        id: number;
    }

    export interface ExamsListOfPatients{
        patientId: number;
        doctorId: number;
        name: string;
        fileId: number;
        examDate: string;
        examType: string;
        id: number;
        patientInfo: String;
    }