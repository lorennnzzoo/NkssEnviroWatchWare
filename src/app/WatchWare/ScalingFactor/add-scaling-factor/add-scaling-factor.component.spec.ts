import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScalingFactorComponent } from './add-scaling-factor.component';

describe('AddScalingFactorComponent', () => {
  let component: AddScalingFactorComponent;
  let fixture: ComponentFixture<AddScalingFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddScalingFactorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddScalingFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
