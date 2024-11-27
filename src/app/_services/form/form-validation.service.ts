import { Injectable, WritableSignal } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  validateFormInputs(formControls: object, errorMessages: Record<string, Array<Record<string, string>>>,
    signals: Record<string, WritableSignal<string | undefined>>, checkForDirty: boolean): void {//boolean{

    Object.entries(formControls).forEach(([controlName, control]) => {
      Object.entries(errorMessages).forEach(([errorName, errors]) => {
        for (let i = 0; i < errors.length; i++) {
          Object.entries(errors[i]).forEach(([errorKey, f]) => {
            let errMessage = typeof f === 'string' ? f.toString() : undefined;
            if (checkForDirty){
              if (this.hasErrorsWithDirtyCheck(control, errorKey)){
                this.setError(controlName, errorName, errMessage, signals);
              }
            }
            else {
              if (this.hasErrors(control, errorKey)) {
                this.setError(controlName, errorName, errMessage, signals);
                // return false;
              }
            }
          })
        }
      })
    })

    // for (const [controlName, control] of Object.entries(formControls)) {
    //   for (const [errorName, errors] of Object.entries(errorMessages)) {
    //     for (let i = 0; i < errors.length; i++) {
    //       for (const [errorKey, f] of Object.entries(errors[i])) {
    //         let errMessage = typeof f === 'string' ? f.toString() : undefined;
    //         if (checkForDirty) {
    //           if (this.hasErrorsWithDirtyCheck(control, errorKey)) {
    //             this.setError(controlName, errorName, errMessage, signals);
    //           }
    //         } else {
    //           if (this.hasErrors(control, errorKey)) {
    //             this.setError(controlName, errorName, errMessage, signals);
    //             return false; // Exit the entire function
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    // return true;
  }

  setError(controlName: string, errorKey: string, errorMessage: string | undefined,
    signals: Record<string, WritableSignal<string | undefined>>): void {
    if (controlName === errorKey) signals[controlName].set(errorMessage);
  }

  hasErrors(control: AbstractControl, validationKey: string){
    if (control.hasError(validationKey.toString())) return true;
    return false;
  }
  
  hasErrorsWithDirtyCheck(control: AbstractControl, validationKey: string){
    if (control.dirty && control.hasError(validationKey.toString())) return true;
    return false;
  }
}
