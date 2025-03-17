import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOxideComponent } from './add-oxide.component';

describe('AddOxideComponent', () => {
  let component: AddOxideComponent;
  let fixture: ComponentFixture<AddOxideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOxideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOxideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
