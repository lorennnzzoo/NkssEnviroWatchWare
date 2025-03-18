import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceedanceComponent } from './exceedance.component';

describe('ExceedanceComponent', () => {
  let component: ExceedanceComponent;
  let fixture: ComponentFixture<ExceedanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExceedanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExceedanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
