import {Role, ROLES} from './Role';
import {enableProdMode} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

export interface AuthRequest {
  login: string;
  password: string;
}

export interface IToken {
  token: string;
}

export interface IJWTUserDecoded {
  id: number;
  sub: string;
  role: Role;
  exp: number;
  iat: number;
  doctor?: number;
  patient?: number;
  login: string;
  imgId?: number;
}

export interface Doctor {
  id?: number;
  crm: string;
  name: string;
  birthDate: string;
}

export interface Patient {
  id?: number;
  doctorId: number;
  cpf: string;
  birthDate: string;
}

export interface MedicUserForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  crm: string;
  birthDate: string;
  login: string;
  password: string;
  fileId: number;
}

export interface PatientUserForm {
  doctorId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  cpf: string;
  birthDate: string;
  login: string;
  password: string;
  fileId: number;
}

export interface PatientList {
  id?: number;
  createdAt: string;
  name: string;
  birthDate: string;
  phoneNumber: string;
  email: string;
}

export interface User {
  patient?: {
    id?: number;
    doctorId: number;
    cpf: string;
    birthDate: string;
    name: string;
  };
  doctor?: {
    id?: number;
    crm: string;
    name: string;
    birthDate: string;
  };
  id?: number;
  login: string;
  password: string;
  role: keyof typeof ROLES;
  email: string;
  phoneNumber: string;
  imgId?: number;
}
