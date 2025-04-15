import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStationConfigComponent } from './create-station-config.component';

describe('CreateStationConfigComponent', () => {
  let component: CreateStationConfigComponent;
  let fixture: ComponentFixture<CreateStationConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStationConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStationConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
