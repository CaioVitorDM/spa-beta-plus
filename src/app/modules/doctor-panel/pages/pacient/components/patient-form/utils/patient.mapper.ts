import {PatientUserForm, User} from '../../../../../../../models/User';

export const toPatientUserEntity = (formData: PatientUserForm): User => {
  return {
    patient: {
      doctorId: formData.doctorId,
      cpf: formData.cpf,
      name: formData.firstName + ' ' + formData.lastName,
      birthDate: formData.birthDate,
    },
    login: formData.login,
    password: formData.password,
    role: 'PATIENT',
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    imgId: formData.fileId,
  };
};
