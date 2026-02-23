import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './image.html',
  styleUrl: './image.css',
})
export class Image {

}
