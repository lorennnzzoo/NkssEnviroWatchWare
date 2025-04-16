import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStationConfigComponent } from './edit-station-config.component';

describe('EditStationConfigComponent', () => {
  let component: EditStationConfigComponent;
  let fixture: ComponentFixture<EditStationConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStationConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStationConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
