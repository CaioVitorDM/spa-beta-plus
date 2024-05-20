import {CommonModule} from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {ControlValueAccessor, FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ItemSelect} from '../custom-select/custom-select.component';

@Component({
  selector: 'app-input-search',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputSearchComponent,
      multi: true
    },
    provideNgxMask()
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxMaskDirective],
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss'],
})
export class InputSearchComponent implements ControlValueAccessor, OnInit {
  @Input() defaultPlaceholder = '';
  @Input() searchPlaceholder = 'Pesquisar';
  @Input() items: ItemSelect[] = [];
  @Input() defaultItemSelected!: ItemSelect;
  @Output() handleSelectItem = new EventEmitter<ItemSelect>();
  @Input() isActiveIcon = false;
  @Input() submitSearchFunction:
    | ((searchType: string | number, searchText: string | null) => void)
    | undefined;
  @Input() cleanSearchFunction: (() => void | undefined) | undefined;

  isOpen = false;
  selectedValue!: ItemSelect;
  searchedValue: string | null = null;
  isSearchSubmitted = false;
  errorMessage: string | null = null;
  mask: string = '';


  constructor(
    private elementRef: ElementRef,
    private cdRef: ChangeDetectorRef 
  ) {
    this.isOpen = false;
    this.defaultPlaceholder = 'Selecione';
  }
  

  ngOnInit(): void {
    if (this.defaultItemSelected && this.defaultItemSelected.label) {
      this.selectItem(this.defaultItemSelected);
    }
    if (this.items.length > 0) {
      this.selectedValue = this.items[0];
    } else {
      this.selectedValue = { value: '', label: '', isDate: false, selected: false };
    }

    this.updateMask();
  }

  updateMask() {
    this.mask = this.isDateSearch() ? '00/00/0000' : '';
    this.cdRef.detectChanges();  
  }
  

  isDateSearch(): boolean {
    return this.selectedValue && this.selectedValue.isDate === true;
  }

  validateDateFormat(value: string | null): boolean {
    if (!value) return true; 
  
    console.log("Value received: ", value);
  
    const regex = /^(0[1-9]|[12][0-9]|3[01])([\/\-]?(0[1-9]|1[0-2]))?([\/\-]?\d{4})?$/;
    return regex.test(value);
  }
  

  onBlur() {
    this.validateAndUpdateErrorMessage();
  }

  onInputChange() {
    this.validateAndUpdateErrorMessage();
  }

  validateAndUpdateErrorMessage() {
    if (this.isDateSearch() && !this.validateDateFormat(this.searchedValue)) {
      this.errorMessage = 'Campo inválido';
    } else {
      this.errorMessage = null;
    }
  }

  onTouched: () => void = () => {};

  onChange: (value: ItemSelect | null) => void = () => {};

  registerOnChange(fn: (value: ItemSelect | null) => void): void {
    this.onChange = fn;
  }
  

  writeValue(item: ItemSelect): void {
    if (item) this.selectedValue = item;
  }

  toggleList() {
    this.isOpen = !this.isOpen;
  }

  selectItem(item: ItemSelect) {
    this.selectedValue = item;
    this.onChange(this.selectedValue);
    this.onTouched();
    this.isOpen = false;
    this.handleSelectItem.emit(item);
    this.updateMask();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.onBlur();
    }
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  submitSearch(searchType: string | number, searchText: string | null): void {
    this.validateAndUpdateErrorMessage(); 
    if (this.errorMessage) {
      return;
    }

    if (searchText === null) {
      return;
    }
    this.searchedValue = searchText;
    this.isSearchSubmitted = true;

    if (this.submitSearchFunction) {
      this.submitSearchFunction(searchType, searchText);
    }
  }

  cleanSearch() {
    this.searchedValue = null;
    this.errorMessage = null; 

    if (!this.isSearchSubmitted) {
      return;
    }

    this.isSearchSubmitted = false;
    if (this.cleanSearchFunction) {
      this.cleanSearchFunction();
    }
  }
}
