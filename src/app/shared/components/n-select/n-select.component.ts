import { Component, input, forwardRef, signal, WritableSignal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'n-select',
  templateUrl: './n-select.component.html',
  styleUrls: ['./n-select.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NSelectComponent),
      multi: true,
    },
  ],
})
export class NSelectComponent implements ControlValueAccessor {
  label = input<string>();
  options = input<any[]>([]);
  multiple = input<boolean>(false);
  // disabled = input<boolean>(false); // Remove this input

  _disabled: WritableSignal<boolean> = signal(false); // Use a private signal for disabled state

  selectCtrl = new FormControl();

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.selectCtrl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled); // Update the private signal
    if (isDisabled) {
      this.selectCtrl.disable();
    } else {
      this.selectCtrl.enable();
    }
  }

  onSelectionChange(value: any): void {
    this.onChange(value);
    this.onTouched();
  }
}