import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListScalingFactorsComponent } from './list-scaling-factors.component';

describe('ListScalingFactorsComponent', () => {
  let component: ListScalingFactorsComponent;
  let fixture: ComponentFixture<ListScalingFactorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListScalingFactorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListScalingFactorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
