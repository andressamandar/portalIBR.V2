import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

export interface PortalAutocompleteOption {
  [key: string]: any;
}

@Component({
  selector: 'app-portal-autocomplete',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './portal-autocomplete.component.html',
  styleUrl: './portal-autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PortalAutocompleteComponent),
      multi: true
    }
  ]
})

export class PortalAutocompleteComponent
  implements ControlValueAccessor, OnInit, OnChanges {
  // ===========================
  // APARÊNCIA
  // ===========================

  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() errorMessage = '';

  @Input() icon = '';

  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;

  @Input() loading = false;

  // ===========================
  // DADOS
  // ===========================

  @Input() options: PortalAutocompleteOption[] = [];

  @Input() optionLabel = 'nome';
  @Input() optionValue = 'id';

  @Input() multiple = false;

  /**
   * Quando true, o componente não filtra localmente.
   * Apenas dispara o evento "search".
   */
  @Input() async = false;

  // ===========================
  // EVENTOS
  // ===========================

  @Output() search = new EventEmitter<string>();

  @Output() valueChange =
    new EventEmitter<
      PortalAutocompleteOption |
      PortalAutocompleteOption[] |
      null
    >();

  // ===========================
  // ESTADO
  // ===========================

  searchText = '';

  filteredOptions: PortalAutocompleteOption[] = [];

  value:
    PortalAutocompleteOption |
    PortalAutocompleteOption[] |
    null = null;

  private formDisabled = false;

  // ===========================
  // CONTROL VALUE ACCESSOR
  // ===========================

  private onChange: (value: any) => void = () => {};

  private onTouched: () => void = () => {};

  // ===========================
  // GETTERS
  // ===========================

  get isDisabled(): boolean {
    return this.disabled || this.formDisabled;
  }

  // ===========================
  // LIFECYCLE
  // ===========================

  ngOnInit(): void {
    this.filteredOptions = [...this.options];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.filteredOptions = [...this.options];

      if (!this.async && this.searchText) {
        this.handleSearch(this.searchText);
      }
    }
  }

  // ===========================
  // CVA
  // ===========================

  writeValue(
      value:
        | PortalAutocompleteOption
        | PortalAutocompleteOption[]
        | null
    ): void {
      this.value = value;

      if (
        !this.multiple &&
        value &&
        !Array.isArray(value)
      ) {
        this.searchText = String(
          value[this.optionLabel] ?? ''
        );
      } else {
        this.searchText = '';
      }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled = disabled;
  }

  // ===========================
  // PESQUISA
  // ===========================

  handleSearch(text: string): void {

    this.searchText = text;

    if (this.async) {
      this.search.emit(text);
      return;
    }

    const termo = text.toLowerCase().trim();

    this.filteredOptions = this.options.filter(option =>
      String(option[this.optionLabel] ?? '')
        .toLowerCase()
        .includes(termo)
    );
  }

  // ===========================
  // SELEÇÃO
  // ===========================

  selectOption(option: PortalAutocompleteOption): void {
    if (this.isDisabled || this.readonly) {
      return;
    }

    if (this.multiple) {
      const values = Array.isArray(this.value)
        ? [...this.value]
        : [];

      const exists = values.some(
        value =>
          value[this.optionValue] ===
          option[this.optionValue]
      );

      if (exists) {
        this.value = values.filter(
          value =>
            value[this.optionValue] !==
            option[this.optionValue]
        );
      } else {
        this.value = [...values, option];
      }
    } else {
      this.value = option;
      this.searchText = String(
        option[this.optionLabel] ?? ''
      );
    }

    this.onChange(this.value);
    this.onTouched();
    this.valueChange.emit(this.value);
  }

  // ===========================
  // AUXILIARES
  // ===========================

 isSelected(option: PortalAutocompleteOption): boolean {
    if (this.multiple) {
      return Array.isArray(this.value)
        && this.value.some(
          value =>
            value[this.optionValue] === option[this.optionValue]
        );
    }

    if (!this.value || Array.isArray(this.value)) {
      return false;
    }

    return (
      this.value[this.optionValue] ===
      option[this.optionValue]
    );
  }

  displayValue(): string {

    if (!this.value) {
      return '';
    }

    if (Array.isArray(this.value)) {

      return this.value
        .map(v => v[this.optionLabel])
        .join(', ');

    }

    return this.value[this.optionLabel];

  }

  handleBlur(): void {
    this.onTouched();

    if (
      !this.multiple &&
      this.value &&
      !Array.isArray(this.value)
    ) {
      this.searchText = String(
        this.value[this.optionLabel] ?? ''
      );
    }
  }

  get selectedOptions(): PortalAutocompleteOption[] {
  return Array.isArray(this.value)
    ? this.value
    : [];
  }

  displayOption = (
    option: PortalAutocompleteOption | string | null
  ): string => {
    if (!option) {
      return '';
    }

    if (typeof option === 'string') {
      return option;
    }

    return String(option[this.optionLabel] ?? '');
  };

  handleOptionSelected(
    option: PortalAutocompleteOption
  ): void {
    this.selectOption(option);

    if (this.multiple) {
      this.searchText = '';
      this.filteredOptions = [...this.options];
    }
  }

}
