import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-common-dialog',
  standalone: true,
  imports: [JsonPipe, MatButtonModule, MatDialogModule],
  templateUrl: './common-dialog.component.html',
  styleUrl: './common-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  auctionData = computed(() => this.data.concludedAuction);
}
