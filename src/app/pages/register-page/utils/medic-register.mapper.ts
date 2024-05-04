import {FormGroup} from '@angular/forms';
import {MedicUserForm, User} from '../../../models/User';

export const toMedicUserEntity = (formData: MedicUserForm): User => {
  return {
    doctor: {
      crm: formData.crm,
      name: formData.firstName + ' ' + formData.lastName,
      birthDate: formData.birthDate,
    },
    login: formData.login,
    password: formData.password,
    role: 'MEDIC',
    email: formData.email,
    phoneNumber: formData.phoneNumber,
  };
};
