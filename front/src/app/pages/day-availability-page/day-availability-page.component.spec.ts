import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayAvailabilityPageComponent } from './day-availability-page.component';

describe('DayAvailabilityPageComponent', () => {
  let component: DayAvailabilityPageComponent;
  let fixture: ComponentFixture<DayAvailabilityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayAvailabilityPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayAvailabilityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
