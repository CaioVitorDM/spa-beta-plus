export interface Beta {
  id: number;
  patientId: number;
  doctorId: number;
  betaDate: string;
  betaValue: number;
}

export interface BetaList {
  id: number;
  patientId?: number;
  doctorId?: number;
  betaDate: string;
  betaValue: number;
}
