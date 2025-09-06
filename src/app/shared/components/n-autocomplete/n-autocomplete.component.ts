
import { Component, input, output, forwardRef, signal, computed } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'n-autocomplete',
  templateUrl: './n-autocomplete.component.html',
  styleUrls: ['./n-autocomplete.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NAutocompleteComponent),
      multi: true,
    },
  ],
})
export class NAutocompleteComponent implements ControlValueAccessor {
  label = input<string>();
  options = input<any[]>([]);
  optionTpl = input<any>();

  searchCtrl = new FormControl();
  filteredOptions: Observable<any[]>;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.filteredOptions = this.searchCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  writeValue(value: any): void {
    this.searchCtrl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onSelectionChange(value: any): void {
    this.onChange(value);
    this.onTouched();
  }

  private _filter(value: string | any): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.options().filter(option => option.name.toLowerCase().includes(filterValue));
  }

  displayFn(option: any): string {
    return option && option.name ? option.name : '';
  }
}
