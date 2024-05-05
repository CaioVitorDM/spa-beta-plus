/**
 * @description
 * Service for handling form utilities and validation.
 *
 * This service provides methods for validating form fields, creating custom validators, and getting error messages for form controls.
 */

import {Injectable} from '@angular/core';
import {UntypedFormArray, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {MESSAGE_VALIDATORS} from '../../constants/messages';

@Injectable({
  providedIn: 'root',
})
export class FormUtilsService {
  /**
   * Recursively marks all form fields as touched in a form group or form array.
   * @param formGroup - The form group or form array to validate.
   */
  validateAllFormFields(formGroup: UntypedFormGroup | UntypedFormArray) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof UntypedFormGroup || control instanceof UntypedFormArray) {
        control.markAsTouched({onlySelf: true});
        this.validateAllFormFields(control);
      }
    });
  }

  /**
   * Get an error message for a specific form field in a form group.
   * @param formGroup - The form group containing the field.
   * @param fieldName - The name of the field to get the error message for.
   * @returns The error message for the field.
   */
  getErrorMessage(formGroup: UntypedFormGroup, fieldName: string): string {
    const field = formGroup.get(fieldName) as UntypedFormControl;
    return this.getErrorMessageFromField(field);
  }

  /**
   * Get an error message for a form control.
   * @param field - The form control to get the error message for.
   * @returns The error message for the control.
   */
  getErrorMessageFromField(field: UntypedFormControl): string {
    const errorMessages: {[key: string]: (field: UntypedFormControl) => string} = {
      required: () => MESSAGE_VALIDATORS.REQUIRED,
      maxlength: (field) => {
        const requiredLength = field.errors?.['maxlength']?.requiredLength;
        return MESSAGE_VALIDATORS.MAX_LENGTH(requiredLength);
      },
      minlength: (field) => {
        const requiredLength = field.errors?.['minlength']?.requiredLength;
        return MESSAGE_VALIDATORS.MIN_LENGTH(requiredLength);
      },
      min: (field) => {
        const requiredValue = field.errors?.['min']?.min;
        return MESSAGE_VALIDATORS.MIN(requiredValue);
      },
      max: (field) => {
        const requiredValue = field.errors?.['max']?.max;
        return MESSAGE_VALIDATORS.MAX(requiredValue);
      },
      alphanumeric: () => MESSAGE_VALIDATORS.ALPHANUMERIC,
      specialChars: () => MESSAGE_VALIDATORS.SPECIAL_CHARS,
      nameExists: () => MESSAGE_VALIDATORS.NAME_EXISTS,
      refIdExists: () => MESSAGE_VALIDATORS.REF_ID_EXISTS,
      eanExists: () => MESSAGE_VALIDATORS.EAN_EXISTS,
      emailExists: () => MESSAGE_VALIDATORS.EMAIL_EXISTS,
      email: () => MESSAGE_VALIDATORS.INVALID_EMAIL,
      invalidCPF: () => MESSAGE_VALIDATORS.INVALID_CPF,
      ageError: () => MESSAGE_VALIDATORS.INVALID_AGE,
      birthYearRangeError: () => MESSAGE_VALIDATORS.INVALID_BIRTH_YEAR_RANGE,
      specialCharsSellerName: () => MESSAGE_VALIDATORS.SPECIAL_CHARS_SELLER,
      notInteger: () => MESSAGE_VALIDATORS.NOT_INTEGER,
      zipCodeStartGreaterZipCodeEnd: () => MESSAGE_VALIDATORS.ZIP_CODE_START_GREATER_ZIP_CODE_END,
      weightStartGreaterWeightEnd: () => MESSAGE_VALIDATORS.WEIGHT_START_FREATER_WEIGHT_END,
      negativeNumber: () => MESSAGE_VALIDATORS.NEGATIVE_NUMBER,
    };

    const errorKeys = Object.keys(errorMessages);

    for (const key of errorKeys) {
      if (field?.hasError(key)) {
        return errorMessages[key](field);
      }
    }

    return field?.errors ? 'Campo inválido' : '';
  }
}
