import {PatientUserForm, User} from '../../../../../../../models/User';

export const toPatientUserEntity = (formData: PatientUserForm): User => {
  return {
    patient: {
      id: formData.patientId,
      doctorId: formData.doctorId,
      cpf: formData.cpf,
      name: formData.firstName + ' ' + formData.lastName,
      birthDate: formData.birthDate,
    },
    id: formData.id,
    login: formData.login,
    password: formData.password,
    role: 'PATIENT',
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    imgId: formData.fileId,
  };
};
