export interface Appointment {
    id: number;
    description: string;
    patientId: number;  
    doctorId: number;
    local: string;
    appointmentDate: string;
  }

  export interface AppointmentList {
    id: number;
    description: string;
    doctorName: string;
    local: string;
    appointmentDate: string;
  }
  
  