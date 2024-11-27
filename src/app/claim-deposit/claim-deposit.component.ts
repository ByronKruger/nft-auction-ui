import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormInputsContainerComponent } from '../common/form-inputs-container/form-inputs-container.component';
import { UserStore } from '../store/users/users.store';
import { ChangeBackgroundService } from '../_services/common/change-background.service';
import { FormValidationService } from '../_services/form/form-validation.service';

@Component({
  selector: 'app-claim-deposit',
  standalone: true,
  imports: [MatFormFieldModule, MatProgressSpinnerModule, ReactiveFormsModule, 
    MatInputModule, CommonModule, MatButtonModule, FormInputsContainerComponent],
  templateUrl: './claim-deposit.component.html',
  styleUrl: './claim-deposit.component.css'
})
export class ClaimDepositComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private validateService = inject(FormValidationService);
  private errorMessages: Record<string, Record<string, string>[]> = {
    'address': [{required: "Address required."}]
  };
  
  form!: FormGroup;
  addressErrorMessage = signal<string>("");
  userStore = inject(UserStore);
  changeBgService = inject(ChangeBackgroundService);

  ngOnInit() {
    this.form = this.formBuilder.group({
      address: ['', [Validators.required]]
    });
    this.form.valueChanges.subscribe(_ => this.validateForm(true));
    this.changeBgService.changeBackgroundSubject$.next("vertical");
  }

  validateForm(checkForDirty: boolean) {
    this.validateService.validateFormInputs(this.form.controls, this.errorMessages,
      {address: this.addressErrorMessage}, checkForDirty);
  }

  onSubmit() {
    this.validateForm(false);
    if (this.form.valid) this.userStore.claimDeposit(this.form.value);
  }
}
