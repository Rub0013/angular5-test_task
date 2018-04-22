import PhoneNumber from 'awesome-phonenumber';
import {AbstractControl, FormControl} from '@angular/forms';


export class Validator {

    public static validatePhoneNumber(control: AbstractControl): any {
        const phone = control.value;
        const pn = new PhoneNumber(phone, 'SE');
        return !pn.isValid() ? {validPhone: true} : null;
    }

    public static validateMultipleValues(fieldsArr: Array<FormControl>, data: any): void {
        for (let i = 0; i < fieldsArr.length; ++i) {
            if (!fieldsArr[i].valid) {
                if (i === 0 || fieldsArr[i].value.length !== 0) {
                    data.valid = false;
                    break;
                }
            }
        }
    }
}