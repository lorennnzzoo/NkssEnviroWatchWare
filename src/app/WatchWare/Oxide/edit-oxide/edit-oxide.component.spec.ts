import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOxideComponent } from './edit-oxide.component';

describe('EditOxideComponent', () => {
  let component: EditOxideComponent;
  let fixture: ComponentFixture<EditOxideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOxideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOxideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
