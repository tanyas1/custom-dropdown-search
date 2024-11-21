import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
export enum Touch {
  Untouched,
  HalfTouched,
  Touched,
}

@Injectable({
  providedIn: 'root',
})
export class TouchedService {
  private touchedTextAreaSubject = new BehaviorSubject<Touch>(Touch.Untouched);
  touchedTextArea$ = this.touchedTextAreaSubject.asObservable();
  private touchedDropdownSubject = new BehaviorSubject<Touch>(Touch.Untouched);
  touchedDropdown$ = this.touchedDropdownSubject.asObservable();
  private touchedDatePickerSubject = new BehaviorSubject<Touch>(
    Touch.Untouched
  );
  touchedDatePicker$ = this.touchedDatePickerSubject.asObservable();
  private touchedInputSubject = new BehaviorSubject<Touch>(Touch.Untouched);
  touchedInputSubject$ = this.touchedInputSubject.asObservable();

  private touchedCheckboxDropdownSubject = new BehaviorSubject<Touch>(
    Touch.Untouched
  );
  touchedCheckboxDropdown$ = this.touchedCheckboxDropdownSubject.asObservable();

  updateTextAreaTouched(value: Touch): void {
    this.touchedTextAreaSubject.next(value);
  }
  updateDropdownTouched(value: Touch): void {
    this.touchedDropdownSubject.next(value);
  }

  updateDatePickerTouched(value: Touch): void {
    this.touchedDatePickerSubject.next(value);
  }

  updateInputTouched(value: Touch): void {
    this.touchedInputSubject.next(value);
  }

  updateCheckboxDropdownTouched(value: Touch): void {
    this.touchedCheckboxDropdownSubject.next(value);
  }

  constructor() {}
}
