import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tasklist } from './tasklist';

describe('Tasklist', () => {
  let component: Tasklist;
  let fixture: ComponentFixture<Tasklist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tasklist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tasklist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
