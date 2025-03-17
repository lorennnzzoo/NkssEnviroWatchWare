import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOxidesComponent } from './list-oxides.component';

describe('ListOxidesComponent', () => {
  let component: ListOxidesComponent;
  let fixture: ComponentFixture<ListOxidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOxidesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOxidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
