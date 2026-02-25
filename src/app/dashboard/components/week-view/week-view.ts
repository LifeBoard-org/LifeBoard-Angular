import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-week-view',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './week-view.html',
  styleUrl: './week-view.css',
})
export class WeekView implements OnInit {


  ngOnInit(): void {
    this.generateUpcomingDays();
  }

  generateUpcomingDays() {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        fullDate: date,
        tasks: []
      });
    }
    this.upcomingDays.set(days);
  }

  upcomingDays = signal<UpcomingDay[]>([]);

}

interface UpcomingDay {
  day: string;
  date: number;
  fullDate: Date;
  tasks: { color: string }[];
}
