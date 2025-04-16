import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChannelConfigComponent } from './create-channel-config.component';

describe('CreateChannelConfigComponent', () => {
  let component: CreateChannelConfigComponent;
  let fixture: ComponentFixture<CreateChannelConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateChannelConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateChannelConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
