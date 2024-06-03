import { AppointmentList } from './Appointment';
import { ProtocolList } from './Protocol';
import {PatientList} from './User';

export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
  error?: {
    error: {
      error: string;
      message: string;
      path: string;
      status: number;
      timestamp: string;
    };
    message: string;
    path: string;
    status: number;
    timestamp: string;
  };
};

export enum Direction {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type Page<T> = {
  content: T;
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: Sort;
  totalElements: number;
  totalPages: number;
};

export type Pageable = {
  offset: number;
  pageNumber?: number;
  pageSize?: number;
  paged?: boolean;
  sort?: Sort;
  unpaged?: boolean;
};

export type Sort = {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
};

export type ParamsPage<T> = {
  size?: number;
  page?: number;
  sort?: keyof T;
  order?: 'ASC' | 'DESC';
};

export interface ParamsPagePatient extends ParamsPage<PatientList> {
  name?: string | null;
  email?: string | null;
  phoneNumber: string | null;
  doctorId: number | null;
}

export interface ParamsPageProtocol extends ParamsPage<ProtocolList> {
  name?: string | null;
  createdAt?: string | null;
  patientId?: number | null;
  doctorId?: number | null;
}

export interface ParamsPageAppointment extends ParamsPage<AppointmentList> {
  description?: string | null;
  patientId?: number | null;
  doctorId?: number | null;
  local?: string | null;
  appointmentDate?: string | null;
}

