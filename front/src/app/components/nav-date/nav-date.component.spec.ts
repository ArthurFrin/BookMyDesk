import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavDateComponent } from './nav-date.component';

describe('NavDateComponent', () => {
  let component: NavDateComponent;
  let fixture: ComponentFixture<NavDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
