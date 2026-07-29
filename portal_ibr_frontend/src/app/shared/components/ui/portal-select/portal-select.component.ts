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
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

export interface PortalSelectOption {
  [key: string]: any;
}

export type PortalSelectValue =
  | PortalSelectOption
  | PortalSelectOption[]
  | null;

@Component({
  selector: 'app-portal-select',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './portal-select.component.html',
  styleUrl: './portal-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PortalSelectComponent),
      multi: true
    }
  ]
})
export class PortalSelectComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() errorMessage = '';

  @Input() icon = '';

  @Input() options: PortalSelectOption[] = [];

  @Input() optionLabel = 'nome';
  @Input() optionValue = 'id';

  @Input() multiple = false;
  @Input() required = false;
  @Input() disabled = false;

  @Output() valueChange =
    new EventEmitter<PortalSelectValue>();

  value: PortalSelectValue = null;

  private formDisabled = false;

  private onChange:
    (value: PortalSelectValue) => void = () => {};

  private onTouched: () => void = () => {};

  get isDisabled(): boolean {
    return this.disabled || this.formDisabled;
  }

  writeValue(value: PortalSelectValue): void {
    this.value = value;
  }

  registerOnChange(
    fn: (value: PortalSelectValue) => void
  ): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled = isDisabled;
  }

  handleSelectionChange(value: PortalSelectValue): void {
    if (this.isDisabled) {
      return;
    }

    this.value = value;

    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  handleTouched(): void {
    this.onTouched();
  }

  compareOptions = (
    firstOption: PortalSelectOption | null,
    secondOption: PortalSelectOption | null
  ): boolean => {
    if (firstOption === secondOption) {
      return true;
    }

    if (!firstOption || !secondOption) {
      return false;
    }

    return (
      firstOption[this.optionValue] ===
      secondOption[this.optionValue]
    );
  };
}