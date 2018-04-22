import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {ApiService} from '../../services/api/api.service';
import {DialogComponent} from '../dialog/dialog.component';
import {Validator} from '../../libs/Validator';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],
    providers: [ApiService]
})
export class FormComponent implements OnInit {

    public userDataForm: FormGroup;

    constructor(private fb: FormBuilder, private api: ApiService, private dialog: MatDialog) {
    }

    ngOnInit() {
        this.userDataForm = this.createFormGroup();
    }

    createFormGroup(): FormGroup {
        return this.fb.group({
            first_name: this.createField('text'),
            last_name: this.createField('text'),
            emails: this.fb.array([
                this.createField('email')
            ]),
            phone_numbers: this.fb.array([
                this.createField('phone_number')
            ])
        });
    }

    addField(type: string): void {
        (this.userDataForm.controls[`${type}s`] as FormArray).push(this.createField(type));
    }

    createField(type: string): FormControl {
        const validators = [];
        if (type === 'email' || type === 'phone_number') {
            type === 'phone_number' ? validators.push(Validator.validatePhoneNumber) : validators.push(Validators.email);
            if (!this.userDataForm) {
                validators.push(Validators.required);
            }
        } else {
            validators.push(Validators.required);
        }
        return new FormControl('', {
            validators,
        });
    }

    handleChange(e: any, index: number, field: string): void {
        const fields = (this.userDataForm.controls[`${field}s`] as FormArray);
        const isLast = fields.length - 1 === index;
        if (isLast && fields.controls[index].valid) {
            this.addField(field);
        }
    }

    isFormValid(): boolean {
        const form = {
            valid: true
        };
        if (!this.userDataForm.get('last_name').valid || !this.userDataForm.get('first_name').valid) {
            form.valid = false;
        }
        const emails = this.userDataForm.get('emails')['controls'];
        const phone_numbers = this.userDataForm.get('phone_numbers')['controls'];
        Validator.validateMultipleValues(emails, form);
        Validator.validateMultipleValues(phone_numbers, form);
        return form.valid;
    }

    openDialog(type: string, message: string): void {
        const dialogRef = this.dialog.open(DialogComponent, {
            width: '250px',
            data: { type, message }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.userDataForm = this.createFormGroup();
        });
    }

    handleSubmit() {
        if (this.isFormValid()) {
            const userData = JSON.parse(JSON.stringify(this.userDataForm.value));
            userData.emails = userData.emails.filter(item => {
                return item.length > 0;
            });
            userData.phone_numbers = userData.phone_numbers.filter(item => {
                return item.length > 0;
            });
            this.api.sendUserDate(userData).subscribe(
                res => {
                    this.openDialog('success', 'User added!');
                },
                err => {
                    this.openDialog('error', 'Something gone wrong!');
                }
            );
        }
    }

}
