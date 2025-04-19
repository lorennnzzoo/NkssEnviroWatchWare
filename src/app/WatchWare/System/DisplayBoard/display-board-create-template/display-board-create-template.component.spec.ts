import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayBoardCreateTemplateComponent } from './display-board-create-template.component';

describe('DisplayBoardComponent', () => {
  let component: DisplayBoardCreateTemplateComponent;
  let fixture: ComponentFixture<DisplayBoardCreateTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayBoardCreateTemplateComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DisplayBoardCreateTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
