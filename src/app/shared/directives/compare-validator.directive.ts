import { Directive, Input } from "@angular/core";
import { Validator, AbstractControl, ValidationErrors, NG_VALIDATORS, ValidatorFn } from "@angular/forms";
import { Subscription } from "rxjs";

// function to be used in reactive form
export function compareValidator(controlNameToCompare: string): ValidatorFn{
  return (control: AbstractControl): ValidationErrors | null => {
    if(control.value === null || control.value.length === 0 ){
      return
    }
    const controlToCompare = control.root.get(controlNameToCompare);
    if(controlToCompare){
      const subscripton: Subscription = controlToCompare.valueChanges.subscribe(() =>{
        control.updateValueAndValidity();
        subscripton.unsubscribe();
      });
    }
    return controlToCompare && controlToCompare.value != control.value ?  {'notEqual': true} : null;
  }
} 


// angular compare validator directive, just user compare="email"
@Directive({
  selector: '[compare]',
  providers: [{provide: NG_VALIDATORS, useExisting: CompareValidatorDirective, multi: true}]
})
export class CompareValidatorDirective implements Validator{
  @Input('compare') controlNameToCompare: string;
  validate(control: AbstractControl): ValidationErrors | null {
    if(control.value === null || control.value.length === 0 ){
      return
    }
    const controlToCompare = control.root.get(this.controlNameToCompare);
    if(controlToCompare){
      const subscripton: Subscription = controlToCompare.valueChanges.subscribe(() =>{
        control.updateValueAndValidity();
        subscripton.unsubscribe();
      });
    }
    return controlToCompare && controlToCompare.value != control.value ?  {'notEqual': true} : null;
  }
}