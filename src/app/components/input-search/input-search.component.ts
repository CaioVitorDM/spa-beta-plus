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
  // errorMessage: string | null = null;
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

   
  }

 

  isDateSearch(): boolean {
    return this.selectedValue && this.selectedValue.isDate === true;
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
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;

    }
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  submitSearch(searchType: string | number, searchText: string | null): void {

    console.log(searchText);
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
    // this.errorMessage = null; 

    if (!this.isSearchSubmitted) {
      return;
    }

    this.isSearchSubmitted = false;
    if (this.cleanSearchFunction) {
      this.cleanSearchFunction();
    }
  }
}
