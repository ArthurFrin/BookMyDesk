import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePasswordPageComponent } from './create-password-page.component';

describe('CreatePasswordPageComponent', () => {
  let component: CreatePasswordPageComponent;
  let fixture: ComponentFixture<CreatePasswordPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePasswordPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
