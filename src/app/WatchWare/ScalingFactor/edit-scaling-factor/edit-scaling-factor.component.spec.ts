import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditScalingFactorComponent } from './edit-scaling-factor.component';

describe('EditScalingFactorComponent', () => {
  let component: EditScalingFactorComponent;
  let fixture: ComponentFixture<EditScalingFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditScalingFactorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditScalingFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
