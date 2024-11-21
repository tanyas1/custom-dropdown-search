import { TemplatePortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface CustomModal {
  templateInstance: TemplatePortal<any>;
  isOpenedFromDropdown: boolean;
  isOpenedFromDatePicker: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modalToggle = new Subject<CustomModal | null>();
  constructor() {}
}
