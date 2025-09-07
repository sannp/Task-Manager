import { Component, input, forwardRef, ViewChild, ElementRef, signal, WritableSignal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'n-input',
  templateUrl: './n-input.component.html',
  styleUrls: ['./n-input.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NInputComponent),
      multi: true,
    },
  ],
})
export class NInputComponent implements ControlValueAccessor {
  label = input<string>();
  type = input<string>('text');
  _disabled: WritableSignal<boolean> = signal(false);
  @ViewChild('inputElement') inputElementRef!: ElementRef<HTMLInputElement>;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    if (this.inputElementRef) {
      this.inputElementRef.nativeElement.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  onInput(event: Event): void {
    this.onChange((event.target as HTMLInputElement).value);
    this.onTouched();
  }
}