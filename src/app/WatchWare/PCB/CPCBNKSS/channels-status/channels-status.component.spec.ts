import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelsStatusComponent } from './channels-status.component';

describe('ChannelsStatusComponent', () => {
  let component: ChannelsStatusComponent;
  let fixture: ComponentFixture<ChannelsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelsStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
