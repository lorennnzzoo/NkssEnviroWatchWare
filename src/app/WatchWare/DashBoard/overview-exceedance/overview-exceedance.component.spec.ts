import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewExceedanceComponent } from './overview-exceedance.component';

describe('OverviewExceedanceComponent', () => {
  let component: OverviewExceedanceComponent;
  let fixture: ComponentFixture<OverviewExceedanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewExceedanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverviewExceedanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
