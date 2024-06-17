export interface Beta {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  value: number;
}

export interface BetaList {
  id: number;
  patientInfo?: string;
  doctorInfo?: string;
  date: string;
  value: number;
}
