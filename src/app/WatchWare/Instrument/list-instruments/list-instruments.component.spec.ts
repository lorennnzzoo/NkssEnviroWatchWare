import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInstrumentsComponent } from './list-instruments.component';

describe('ListInstrumentsComponent', () => {
  let component: ListInstrumentsComponent;
  let fixture: ComponentFixture<ListInstrumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListInstrumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInstrumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
