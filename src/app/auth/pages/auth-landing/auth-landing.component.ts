import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/theme/theme.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './auth-landing.component.html',
  styleUrl: './auth-landing.component.css'
})
export class AuthLandingComponent {
  private readonly themeService = inject(ThemeService);

  toggle() {
    this.themeService.toggle();
  }
}
