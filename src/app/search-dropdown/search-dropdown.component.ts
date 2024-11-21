import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';

import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalService } from '../modal.service';
import { TouchedService } from '../touched.service';

export interface CheckboxDropdownObject {
  label: number | string;
  value: number | string;
  selected: boolean;
}

enum Touch {
  Untouched,
  HalfTouched,
  Touched,
}

@Component({
  selector: 'app-search-dropdown',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SearchDropdownComponent,
    },
  ],
  templateUrl: './search-dropdown.component.html',
  styleUrl: './search-dropdown.component.scss',
})
export class SearchDropdownComponent {
  @Input() search: boolean = false;
  @Input() required: boolean = false;
  @Input() label: string = '';
  @Input() helperText: string = '';
  @Input() placeholder: string = '';
  @Input() entity: string = 'item';
  @Input() size: string = '';
  @Input() options: CheckboxDropdownObject[] = [];
  @Input() disabled = false;
  @Input() errorMessage = '';

  @ViewChild('dropdownFieldRef') dropdownFieldRef!: ElementRef;
  @ViewChild('dropdownMenuRef') dropdownMenuRef!: ElementRef;
  @ViewChild('valueRef') valueRef!: ElementRef;

  @Output() valueChange = new EventEmitter();

  @ViewChild('checkboxDropdownMenuTemplate')
  checkboxDropdownMenuTemplate!: TemplatePortal<any>;
  top: any;
  width: any;
  left: any;
  bottom: any;
  dropdownHeight: any;
  dropDownPosition: any;

  values: Array<string | number> = [];
  valueObjects: Array<CheckboxDropdownObject> = [];
  displayedValue: number | string = '';
  allSelected: boolean = true;

  dropdownToggle: boolean = false;
  touched: Touch = Touch.Untouched;
  touchedSubscription!: Subscription;

  onChange = (value: any) => {};
  onTouched = () => {};

  selectorClassList: string[] = [
    'check-box-input-field',
    'check-box-input-value',
    'check-box-dropdown-icon',
    'check-box-dropdown-menu',
    'check-box-search',
    'check-box-search-input',
    'check-box-options',
    'check-box-option',
    'check-box-input',
    'checkbox',
    'checkmark',
    'label',
    'check-box-search-icon',
  ];

  constructor(
    private renderer: Renderer2,
    private modalService: ModalService,
    private touchedService: TouchedService
  ) {}

  ngAfterViewInit(): void {
    this.renderer.listen('window', 'click', (e: Event) => {
      let clickedInside = false;
      if ((e.target as any)['classList'].contains('modal-overlay')) {
        clickedInside = false;
      } else {
        clickedInside = true;
        return;
      }
      if (!clickedInside) {
        this.toggle(false);
        this.touched = Touch.Touched;
        this.touchedService.updateCheckboxDropdownTouched(Touch.Touched);
      }
    });

    this.touchedSubscription =
      this.touchedService.touchedCheckboxDropdown$.subscribe((value: Touch) => {
        this.touched = value;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.valueObjects = [];
    this.values = [];
    if (this.options.length) {
      this.options.forEach((option) => {
        this.allSelected = this.allSelected && option.selected;
        if (option.selected) {
          this.valueObjects.push(option);
          this.values.push(option.value);
        }
      });
      this.generateDisplayedValue();
    }
  }

  toggle(toggleValue: boolean) {
    if (this.touched === 2) {
      // this.touched = true;
      this.onTouched();
    }
    if (toggleValue) {
      this.renderer.addClass(this.dropdownFieldRef?.nativeElement, 'active');
      this.valueRef?.nativeElement.focus();
      this.dropdownToggle = true;

      this.modalService.modalToggle.next({
        templateInstance: this.checkboxDropdownMenuTemplate,
        isOpenedFromDropdown: true,
        isOpenedFromDatePicker: false,
      });
      const dropdown = this.dropdownFieldRef?.nativeElement;
      const rect = dropdown.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceleft = rect.left;
      this.left = spaceleft;
      this.width = this.dropdownFieldRef?.nativeElement.offsetWidth;
      const baseFontSize = window
        .getComputedStyle(document.body)
        .getPropertyValue('font-size');
      const fontSizeWithoutPx = parseFloat(baseFontSize);
      if (this.search) {
        this.dropdownHeight =
          this.options.length * (fontSizeWithoutPx * 2.5) +
          1.75 * fontSizeWithoutPx;
      } else {
        this.dropdownHeight = this.options.length * (fontSizeWithoutPx * 2.5);
      }
      const dropdownMaxHeight = 15 * fontSizeWithoutPx;
      if (this.dropdownHeight > dropdownMaxHeight) {
        this.dropdownHeight = dropdownMaxHeight;
      }
      if (spaceBelow < this.dropdownHeight) {
        this.bottom =
          spaceBelow + this.dropdownFieldRef?.nativeElement.offsetHeight + 8;
        this.dropDownPosition = 'up';
      } else {
        this.top =
          this.dropdownFieldRef?.nativeElement.offsetHeight + spaceAbove + 8;
        this.dropDownPosition = 'down';
      }
    } else {
      this.renderer.removeClass(this.dropdownFieldRef?.nativeElement, 'active');
      this.valueRef?.nativeElement.blur();
      this.dropdownToggle = false;
      this.modalService.modalToggle.next(null);
    }
  }

  onClick(option: CheckboxDropdownObject) {
    if (this.disabled) {
      return;
    }
    if (option.selected === undefined || option.selected === false) {
      this.values.push(option.value);
      this.valueObjects.push(option);
      option.selected = true;
      this.generateDisplayedValue();
    } else if (option.selected) {
      // let index = this.values.indexOf(option.value);
      let index = this.valueObjects.findIndex(
        (obj: any) => obj.value === option.value
      );
      this.values.splice(index, 1);
      this.valueObjects.splice(index, 1);
      option.selected = false;
      this.generateDisplayedValue();
    }
    if (this.valueObjects.length < this.options.length) {
      this.allSelected = false;
    } else if (this.valueObjects.length === this.options.length) {
      this.allSelected = true;
    }
    this.onChange(this.values);
    this.valueChange.emit(this.valueObjects.map((obj) => obj.value));
  }

  generateDisplayedValue() {
    if (this.valueObjects.length === 0) {
      this.displayedValue = 'Select a ' + this.entity;
      return;
    }
    let noun =
      ' ' +
      this.entity +
      (this.valueObjects.length > 1 ? 's' : '') +
      ' selected';
    this.displayedValue = noun;
  }

  onSelectAll() {
    if (this.disabled) {
      return;
    }
    let pastAllSelectedStatus = this.allSelected;
    this.options.forEach((option) => {
      if (option.selected === pastAllSelectedStatus) {
        this.onClick(option);
      }
    });
  }

  writeValue(values: Array<string | number>) {
    this.values = values;
    this.options.forEach((option) => {
      if (this.values.includes(option.value)) {
        option.selected = true;
      }
    });
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }
}
