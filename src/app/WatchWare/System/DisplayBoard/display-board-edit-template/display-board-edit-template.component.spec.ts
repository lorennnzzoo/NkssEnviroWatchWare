import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayBoardEditTemplateComponent } from './display-board-edit-template.component';

describe('DisplayBoardEditTemplateComponent', () => {
  let component: DisplayBoardEditTemplateComponent;
  let fixture: ComponentFixture<DisplayBoardEditTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayBoardEditTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayBoardEditTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
