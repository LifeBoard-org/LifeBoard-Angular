import { Component, inject } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-toggle-theme',
  imports: [],
  templateUrl: './toggle-theme.html',
  styleUrl: './toggle-theme.css',
})
export class ToggleTheme {
  private themeServices = inject(ThemeService);


  get getMode() {
    return this.themeServices.isDarkMode()
  }
  toggle() {
    this.themeServices.toggle()
  }
}
