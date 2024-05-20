/* eslint-disable @typescript-eslint/no-empty-function */
import {CommonModule} from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  forwardRef,
} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';

export type ItemSelect = {
  value: string | number;
  label: string;
  selected?: boolean;
  isDate?: boolean;
};

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
})
export class CustomSelectComponent implements ControlValueAccessor, OnInit {
  @Input() defaultPlaceholder = '';
  @Input() items: ItemSelect[] = [];
  @Input() defaultItemSelected!: ItemSelect;
  @Output() defaultItemSelectedChange = new EventEmitter<ItemSelect>();
  @Input() isActiveIcon = false;
  @Input() disableComponent?: boolean;
  @Input() paginator = false;

  selectedValue!: ItemSelect;

  isOpen = false;

  constructor(private elementRef: ElementRef) {
    this.isOpen = false;
    this.defaultPlaceholder = 'Selecione';
  }

  ngOnInit(): void {
    if (this.defaultItemSelected?.label) {
      this.selectItem(this.defaultItemSelected);
    }
  }

  trackByFn(index: number, item: ItemSelect): number {
    return Number(item.value);
  }

  onChanged: (value: ItemSelect | null) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(item: ItemSelect): void {
    if (item) this.defaultItemSelected = item;
    this.selectedValue = item;
  }

  registerOnChange(fn: (value: ItemSelect | null) => void): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  toggleList() {
    if (!this.disableComponent) {
      this.isOpen = !this.isOpen;
    }
  }

  selectItem(item: ItemSelect) {
    this.defaultItemSelected = item;
    this.onChanged(this.defaultItemSelected);
    this.onTouched();
    this.isOpen = false;
    this.defaultItemSelectedChange.emit(item);
    this.selectedValue = item;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
