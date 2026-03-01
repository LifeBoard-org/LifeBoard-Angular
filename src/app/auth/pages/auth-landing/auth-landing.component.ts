import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/theme/theme.service';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  imports: [RouterLink, CommonModule],
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
