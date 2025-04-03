import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindroseComponent } from './windrose.component';

describe('WindroseComponent', () => {
  let component: WindroseComponent;
  let fixture: ComponentFixture<WindroseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WindroseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindroseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
