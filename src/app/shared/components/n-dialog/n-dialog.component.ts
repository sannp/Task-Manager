
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface NDialogData {
  title: string;
  message: string;
  type: 'alert' | 'confirm' | 'warning';
  confirmButtonText?: string;
  cancelButtonText?: string;
}

@Component({
  selector: 'n-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './n-dialog.component.html',
  styleUrls: ['./n-dialog.component.scss'],
})
export class NDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
