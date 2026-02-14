import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Image } from './image';

describe('Image', () => {
  let component: Image;
  let fixture: ComponentFixture<Image>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Image]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Image);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
