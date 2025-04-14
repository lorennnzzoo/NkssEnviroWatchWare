import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSusbcriptionComponent } from './create-susbcription.component';

describe('CreateSusbcriptionComponent', () => {
  let component: CreateSusbcriptionComponent;
  let fixture: ComponentFixture<CreateSusbcriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSusbcriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSusbcriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
