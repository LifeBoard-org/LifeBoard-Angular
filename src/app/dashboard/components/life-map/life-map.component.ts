import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

export type LifeMapIntensity = 0 | 1 | 2 | 3 | 4;

export interface LifeMapDay {
  date: Date;
  intensity: LifeMapIntensity;
  isFuture?: boolean;
  isToday?: boolean;
}

@Component({
  selector: 'app-life-map',
  standalone: true,
  templateUrl: './life-map.component.html',
  imports: [CommonModule,RouterLink],
})
export class LifeMapComponent implements OnInit {

  readonly today = new Date();
  readonly weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  ngOnInit() {
    this.generateMockData();
  }
  groupedDays:any = {};
  generateMockData() {
    let firstDay = new Date(this.today.getFullYear(), 0, 1);
    const lastDay = new Date(this.today.getFullYear(), 12, 0);
    this.months.forEach((m, i) => {
      this.groupedDays[m] = [];
      while (firstDay.getMonth() == i) {
        let week = [];
        for (let j = 0; j < 7; j++) {
          if (firstDay.getDay() == j) {
            week.push(new Date(firstDay));
            firstDay.setTime(firstDay.getTime() + (24 * 60 * 60 * 1000))
          } else {
            week.push("-1");
          }
          if (firstDay.getMonth() != i) {
            while (week.length != 7) {
              week.push("-1");
            }
            break;
          };
        }

        this.groupedDays[m].push(week);
      }
    })
  }

}
