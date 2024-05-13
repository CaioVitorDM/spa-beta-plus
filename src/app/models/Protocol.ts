
export interface Protocol {
    id: number;
    name: string;
    description?: string;  
    fileId: number;
    pacientsIdList: number[];
    isSpecific: boolean;
    createdAt: string;
  }

  export interface ProtocolList {
    id: number;
    name: string;
    createdAt: string;
  }
  
  