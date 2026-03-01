import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BoardStateService } from '../../../core/services/board-state.service';

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

  private boardStateService = inject(BoardStateService);

  readonly today = new Date();
  readonly weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  ngOnInit() {
    this.generateMockData();
  }
  groupedDays = signal<Record<string, (Date | "-1")[][]>>({});

  // Track `items` signal execution implicitly inside getHeatmapClass when the view relies on it
  itemCounts = computed(() => {
    // Accessing `this.boardStateService.items()` establishes a reactive dependency.
    // Doing O(365*N) directly inside the template is extremely fast for our N (< 10_000).
    return this.boardStateService.items();
  });
  generateMockData() {
    let firstDay = new Date(this.today.getFullYear(), 0, 1);
    const lastDay = new Date(this.today.getFullYear(), 12, 0);
    const newGroupedDays: Record<string, (Date | "-1")[][]> = {};
    this.months.forEach((m, i) => {
      newGroupedDays[m] = [];
      while (firstDay.getMonth() == i) {
        let week: (Date | "-1")[] = [];
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

  getHeatmapClass(day: Date | "-1", trackItemsObj: any) {
    if (day === "-1") return '';
    const localDateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    const count = this.boardStateService.getItemCountForDate(localDateStr);

    let base = "cursor-pointer rounded-[3px] flex justify-center items-center ";
    if (count === 0) return base + "bg-black/10 dark:bg-white/10";
    if (count <= 1) return base + "bg-primary/30 text-white";
    if (count <= 3) return base + "bg-primary/50 text-white";
    if (count <= 5) return base + "bg-primary/80 text-black";
    return base + "bg-primary text-black";
  }

  asDate(day: Date | "-1"): Date {
    return day as Date;
  }

}
