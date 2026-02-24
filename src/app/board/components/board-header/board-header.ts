import { ChangeDetectionStrategy, Component, input, model, output, signal } from '@angular/core';
import { ToggleTheme } from '../../../core/theme/toggle-theme/toggle-theme';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WeekView } from "../../../dashboard/components/week-view/week-view";

@Component({
  selector: 'app-board-header',
  imports: [ToggleTheme, DatePipe, RouterLink, WeekView],
  templateUrl: './board-header.html',
  styleUrl: './board-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardHeader {
  boardDate = model<Date>();
  isPanning = input<boolean>();
  togglePanning = output<void>();

  showWeekView = signal<boolean>(false);

  toggleWeekView() {
    this.showWeekView.set(!this.showWeekView());
  }

  prevDay() {
    const current = this.boardDate();
    if (current) {
      this.boardDate.set(new Date(current.getTime() - 86400000));
    }
  }

  nextDay() {
    const current = this.boardDate();
    if (current) {
      this.boardDate.set(new Date(current.getTime() + 86400000));
    }
  }
}
