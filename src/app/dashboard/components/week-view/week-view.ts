import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BoardStateService } from '../../../core/services/board-state.service';

@Component({
  selector: 'app-week-view',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './week-view.html',
  styleUrl: './week-view.css',
})
export class WeekView {

  private boardStateService = inject(BoardStateService);


  private today = new Date();

  upcomingDays = computed<UpcomingDay[]>(() => {
    const days: UpcomingDay[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.today);
      date.setDate(this.today.getDate() + i);

      const localDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const colors = this.boardStateService.getUniqueItemColorsForDate(localDateStr);

      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        fullDate: date,
        tasks: colors.map((c: string) => ({ color: c }))
      });
    }
    return days;
  });

}

interface UpcomingDay {
  day: string;
  date: number;
  fullDate: Date;
  tasks: { color: string }[];
}
