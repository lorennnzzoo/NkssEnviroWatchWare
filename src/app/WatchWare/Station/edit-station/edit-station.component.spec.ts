import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStationComponent } from './edit-station.component';

describe('EditStationComponent', () => {
  let component: EditStationComponent;
  let fixture: ComponentFixture<EditStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
