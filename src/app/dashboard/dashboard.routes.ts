import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { HomeComponent } from "./pages/home/home.component";

export const DASHBOARD_ROUTES:Routes = [
    {
        path:'',
        component:DashboardComponent,
        children:[
            {path:'',component:HomeComponent},
        ]
    }
]