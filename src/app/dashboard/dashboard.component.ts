import { Component } from "@angular/core";
import { RouterOutlet } from '@angular/router';
import { SideNavComponent } from "./components/sidebar/side-nav.component";
@Component({
    selector: 'dashboard-component',
    templateUrl:'./dashboard.component.html',
    imports: [RouterOutlet,SideNavComponent],
})
export class DashboardComponent {}