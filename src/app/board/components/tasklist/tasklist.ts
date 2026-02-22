import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tasklist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './tasklist.html',
  styleUrl: './tasklist.css',
})
export class Tasklist {

}
