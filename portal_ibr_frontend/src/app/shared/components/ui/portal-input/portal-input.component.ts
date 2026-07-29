import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-portal-input',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './portal-input.component.html',
  styleUrl: './portal-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PortalInputComponent),
      multi: true
    }
  ]
})
export class PortalInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() errorMessage = '';

  @Input() type:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'tel' = 'text';

  @Input() icon = '';
  @Input() suffixIcon = '';
  @Input() required = false;
  @Input() readonly = false;
  @Input() loading = false;
  @Input() disabled = false;
  @Input() autocomplete = 'off';
  @Input() maxlength: number | null = null;
  @Input() minlength: number | null = null;

  @Output() suffixClick = new EventEmitter<void>();
  @Output() valueChange = new EventEmitter<string>();

  value = '';
  passwordVisible = false;

  private formDisabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get inputType(): string {
    if (this.type === 'password') {
      return this.passwordVisible ? 'text' : 'password';
    }

    return this.type;
  }

  get showPasswordToggle(): boolean {
    return this.type === 'password';
  }

  get isDisabled(): boolean {
    return this.disabled || this.formDisabled;
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled = isDisabled;
  }

  handleInput(value: string): void {
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  handleBlur(): void {
    this.onTouched();
  }

  togglePasswordVisibility(): void {
    if (this.isDisabled || this.readonly) {
      return;
    }

    this.passwordVisible = !this.passwordVisible;
  }

  handleSuffixClick(): void {
    if (this.isDisabled) {
      return;
    }

    this.suffixClick.emit();
  }
}