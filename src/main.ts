import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { SearchDropdownComponent } from './app/search-dropdown/search-dropdown.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SearchDropdownComponent],
  template: `
   <app-search-dropdown></app-search-dropdown>
  `,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
