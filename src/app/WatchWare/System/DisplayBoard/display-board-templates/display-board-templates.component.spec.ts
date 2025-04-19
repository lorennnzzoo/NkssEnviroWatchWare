import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayBoardTemplatesComponent } from './display-board-templates.component';

describe('DisplayBoardTemplatesComponent', () => {
  let component: DisplayBoardTemplatesComponent;
  let fixture: ComponentFixture<DisplayBoardTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayBoardTemplatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayBoardTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
