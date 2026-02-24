import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardHeader } from './board-header';

describe('BoardHeader', () => {
  let component: BoardHeader;
  let fixture: ComponentFixture<BoardHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
