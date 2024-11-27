import { Component, input, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FormInputsContainerComponent } from '../form-inputs-container/form-inputs-container.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [FormInputsContainerComponent, NgxSkeletonLoaderModule, MatButtonModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css'
})
export class EmptyStateComponent {
  emptyStateTitle = input();
}
