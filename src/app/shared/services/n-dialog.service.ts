import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NDialogComponent, NDialogData } from '../components/n-dialog/n-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NDialogService {
  private dialog = inject(MatDialog);

  alert(title: string, message: string, buttonText: string = 'Ok'): Observable<any> {
    return this.dialog.open(NDialogComponent, {
      data: {
        title,
        message,
        type: 'alert',
        confirmButtonText: buttonText,
      } as NDialogData,
      autoFocus: false,
    }).afterClosed();
  }

  confirm(title: string, message: string, confirmButtonText: string = 'Confirm', cancelButtonText: string = 'Cancel'): Observable<boolean> {
    return this.dialog.open(NDialogComponent, {
      data: {
        title,
        message,
        type: 'confirm',
        confirmButtonText,
        cancelButtonText,
      } as NDialogData,
      autoFocus: false,
    }).afterClosed();
  }

  warning(title: string, message: string, confirmButtonText: string = 'Ok', cancelButtonText: string = 'Cancel'): Observable<boolean> {
    return this.dialog.open(NDialogComponent, {
      data: {
        title,
        message,
        type: 'warning',
        confirmButtonText,
        cancelButtonText,
      } as NDialogData,
      autoFocus: false,
    }).afterClosed();
  }
}