import { HttpClientModule } from '@angular/common/http';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { UserStore } from '../store/users/users.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormValidationService } from '../_services/form/form-validation.service';
import { CommonButtonComponent } from '../common/common-button/common-button.component';
import { ChangeBackgroundService } from '../_services/common/change-background.service';
import { FormInputsContainerComponent } from '../common/form-inputs-container/form-inputs-container.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    RouterModule, MatProgressSpinnerModule, CommonButtonComponent,
    FormInputsContainerComponent],
  providers: [UserStore],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private loginService = inject(UserService);
  
  changeBgService = inject(ChangeBackgroundService);
  form!: FormGroup;
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  userStore = inject(UserStore);
  a = effect(() => {
    console.log("this.userStore.authResult().errorMessage");
    console.log(this.userStore.authResult().errorMessage);
  })
  usernameErrorMessage = signal<string | undefined>("");
  passwordErrorMessage = signal<string | undefined>("");
  validationService = inject(FormValidationService);
  errorMessages: Record<string, Record<string, string>[]> = { 
    username: [{required: "Username is required." }],
    password: [{ required: "Password is required." }, 
      { minlength: "Password must at least be 12 characters long." }
    ] 
  };
  
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.form.valueChanges.subscribe(_ => this.validateForm(true));
    this.changeBgService.changeBackgroundSubject$.next("vertical");
  }

  validateForm(checkForDirty: boolean) {
    this.validationService.validateFormInputs(
      this.form.controls, 
      this.errorMessages, 
      { 
        username: this.usernameErrorMessage,
        password: this.passwordErrorMessage 
      },
      checkForDirty
    )
  }

  onSubmitLogin(): void {
    this.validateForm(false);
    if (this.form.valid) this.userStore.authUser(this.form.value);
  }

  protectedResource() {
    this.loginService.protectedResource();
  }
}
