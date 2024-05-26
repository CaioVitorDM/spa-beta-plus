export interface Appointment {
    id: number;
    title: string;
    patientId: number;  
    doctorId: number;
    local: string;
    appointmentDate: string;
  }

  export interface AppointmentList {
    id: number;
    title: string;
    doctorName: string;
    local: string;
    appointmentDate: string;
  }
  
  