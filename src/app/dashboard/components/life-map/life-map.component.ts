import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './life-map.component.html',
  imports: [CommonModule, RouterLink],
})
export class LifeMapComponent implements OnInit {

  readonly today = new Date();
  readonly weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  ngOnInit() {
    this.generateMockData();
  }
  groupedDays = signal<any>({});
  generateMockData() {
    let firstDay = new Date(this.today.getFullYear(), 0, 1);
    const lastDay = new Date(this.today.getFullYear(), 12, 0);
    const newGroupedDays: any = {};
    this.months.forEach((m, i) => {
      newGroupedDays[m] = [];
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

        newGroupedDays[m].push(week);
      }
    })
    this.groupedDays.set(newGroupedDays);
  }

}
