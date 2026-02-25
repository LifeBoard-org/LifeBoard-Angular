import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekView } from './week-view';

describe('WeekView', () => {
  let component: WeekView;
  let fixture: ComponentFixture<WeekView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
