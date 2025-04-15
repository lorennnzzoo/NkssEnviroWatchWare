import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationsStatusComponent } from './stations-status.component';

describe('StationsStatusComponent', () => {
  let component: StationsStatusComponent;
  let fixture: ComponentFixture<StationsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationsStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
