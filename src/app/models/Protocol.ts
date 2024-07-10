
export interface Protocol {
    id: number;
    name: string;
    description?: string;  
    fileId: number;
    doctorId: number;
    patientsIdList: number[];
    isSpecific: boolean;
    createdAt: string;
  }

  export interface ProtocolList {
    id: number;
    name: string;
    description?: string;
    createdAt?: string;
    fileId?: number;
  }
  
  