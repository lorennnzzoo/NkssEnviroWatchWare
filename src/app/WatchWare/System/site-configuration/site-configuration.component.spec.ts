import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteConfigurationComponent } from './site-configuration.component';

describe('SiteConfigurationComponent', () => {
  let component: SiteConfigurationComponent;
  let fixture: ComponentFixture<SiteConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
