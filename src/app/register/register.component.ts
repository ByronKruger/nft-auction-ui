import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { CommonButtonComponent } from '../common/common-button/common-button.component';
import { FormInputsContainerComponent } from '../common/form-inputs-container/form-inputs-container.component';
import { UserStore } from '../store/users/users.store';
import { ChangeBackgroundService } from '../_services/common/change-background.service';
import { FormValidationService } from '../_services/form/form-validation.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatButtonModule, MatProgressSpinnerModule, MatFormFieldModule,
    ReactiveFormsModule, MatInputModule, CommonModule, MatSelectModule,
    CommonButtonComponent, FormInputsContainerComponent],
  providers: [UserStore],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private validationService = inject(FormValidationService);
  private errorMessages: Record<string, Record<string, string>[]> = { 
    username: [{ required: "Username is required." }],
    password: [{ required: "Password is required." }, 
    { minlength: "Password must at least be 12 characters long." }],
    userType: [{ required: "User type is required." }],
    new: [{ required: "new is req." }]
  };

  // form!: FormGroup;
  usernameErrorMessage = signal<string>("");
  passwordErrorMessage = signal<string>("");
  userTypeErrorMessage = signal<string>("");
  userStore = inject(UserStore);
  selectedRole?: string;
  changeBgService = inject(ChangeBackgroundService);
  form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(10)]],
    userType: ['', Validators.required]
  })

  ngOnInit(): void {
    this.userStore.getUserRoles();
    // this.form = this.fb.group({
    //   username: ['', Validators.required],
    //   password: ['', Validators.required, Validators.minLength(24)],
    //   userType: ['', Validators.required],
    //   new: ['', Validators.required]
    // })
    this.form.valueChanges.subscribe(_ => this.validateForm(true));
    this.changeBgService.changeBackgroundSubject$.next("vertical");
  }

  validateForm(checkForDirty: boolean) {
    this.validationService.validateFormInputs(
      this.form.controls, 
      this.errorMessages, 
      { 
        username: this.usernameErrorMessage,
        password: this.passwordErrorMessage,
        userType: this.userTypeErrorMessage
      },
      checkForDirty
    )
  }

  updateForm() {
    this.form.controls['userType'].setValue(this.selectedRole);
    this.form.controls['userType'].updateValueAndValidity({emitEvent: true, onlySelf: true});
  }

  onRegister() {
    this.validateForm(false);
    if (this.form.valid) this.userStore.registerUser(this.form.value);
  }
}
