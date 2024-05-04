/**
 * @description
 * Service for handling form utilities and validation.
 *
 * This service provides methods for validating form fields, creating custom validators, and getting error messages for form controls.
 */

import {Injectable} from '@angular/core';
import {UntypedFormArray, UntypedFormControl, UntypedFormGroup} from '@angular/forms';

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
}
