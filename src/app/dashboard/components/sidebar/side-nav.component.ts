// side-nav.component.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavItem } from '../../../core/models/nav-item.model';
import { ThemeService } from '../../../core/theme/theme.service';

@Component({
  selector: 'lb-side-nav',
  templateUrl: './side-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavComponent {

  readonly navItems: NavItem[] = [
    { label: 'Home', icon: 'home', route: '/app' },
    { label: 'Boards', icon: 'dashboard', route: '/app/boards' },
    { label: 'Profile', icon: 'person', route: '/app/profile' },
    { label: 'Settings', icon: 'settings', route: '/app/settings' }
  ];

  constructor(
    private router: Router,
    private themeServices:ThemeService
  ) {}

  navigate(route: string): void {
    this.router.navigateByUrl(route);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
  toggle(){
    this.themeServices.toggle()
  }
}
