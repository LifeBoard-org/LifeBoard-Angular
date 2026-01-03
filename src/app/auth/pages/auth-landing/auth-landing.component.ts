import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/theme/theme.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl:'./auth-landing.component.html',
  styleUrl:'./auth-landing.component.css'
})
export class AuthLandingComponent {
  constructor(
    private readonly themeService:ThemeService
  ){}

  toggle(){
    this.themeService.toggle();
  }
}
