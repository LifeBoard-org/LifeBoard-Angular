import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LifeMapComponent } from '../../components/life-map/life-map.component';

interface Stat {
  label: string;
  value: string;
  change?: string;
  icon: string;
  color: string;
  changeColor?: string;
}

interface UpcomingDay {
  day: string;
  date: number;
  tasks: { color: string }[];
}

interface HeatmapCell {
    level: number; // 0-4 (0 = none, 4 = high)
    isToday?: boolean;
    isFuture?: boolean;
    isDashed?: boolean;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, DatePipe,LifeMapComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly userName = signal('Alex');
  readonly currentDate = signal(new Date());
  readonly focus = signal('Deep Work & Health');

  readonly quickStats = signal<Stat[]>([
    {
      label: 'Current Streak',
      value: '12',
      icon: 'local_fire_department',
      color: 'text-orange-500 bg-orange-500/20',
    },
    {
      label: 'Tasks Completed',
      value: '856',
      change: '+5%',
      icon: 'check_circle',
      color: 'text-blue-500 bg-blue-500/20',
      changeColor: 'text-primary bg-primary/10'
    }
  ]);

  readonly upcomingDays = signal<UpcomingDay[]>([
    { day: 'Wed', date: 25, tasks: [{ color: 'bg-primary' }, { color: 'bg-primary' }] },
    { day: 'Thu', date: 26, tasks: [{ color: 'bg-orange-400' }] },
    { day: 'Fri', date: 27, tasks: [{ color: 'bg-primary' }, { color: 'bg-primary' }, { color: 'bg-primary' }] },
    { day: 'Sat', date: 28, tasks: [{ color: 'bg-blue-400' }] },
    { day: 'Sun', date: 29, tasks: [] },
    { day: 'Mon', date: 30, tasks: [{ color: 'bg-primary' }] },
    { day: 'Tue', date: 31, tasks: [{ color: 'bg-primary' }, { color: 'bg-primary' }] }
  ]);

  readonly heatmapMonths = signal(['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']);
  readonly heatmapData = signal<HeatmapCell[][]>(this.generateHeatmapData());

  private generateHeatmapData(): HeatmapCell[][] {
    const columns = 52;
    const rows = 7;
    const data: HeatmapCell[][] = [];

    const todayColumnIndex = 48;
    const todayRowIndex = new Date().getDay(); 

    for (let c = 0; c < columns; c++) {
      const column: HeatmapCell[] = [];
      for (let r = 0; r < rows; r++) {
        if (c < todayColumnIndex || (c === todayColumnIndex && r < todayRowIndex)) {
            const level = Math.floor(Math.random() * 5); 
            column.push({ level });
        } else if (c === todayColumnIndex && r === todayRowIndex) {
            column.push({ level: 4, isToday: true }); 
        } else if (c === todayColumnIndex && r > todayRowIndex) {
            column.push({ level: 0, isDashed: true });
        } else {
            column.push({ level: 0, isFuture: true });
        }
      }
      data.push(column);
    }
    return data;
  }
}
