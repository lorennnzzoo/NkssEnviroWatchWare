import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSusbcriptionComponent } from './edit-susbcription.component';

describe('EditSusbcriptionComponent', () => {
  let component: EditSusbcriptionComponent;
  let fixture: ComponentFixture<EditSusbcriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSusbcriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSusbcriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
