import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChannelConfigComponent } from './edit-channel-config.component';

describe('EditChannelConfigComponent', () => {
  let component: EditChannelConfigComponent;
  let fixture: ComponentFixture<EditChannelConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditChannelConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditChannelConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
