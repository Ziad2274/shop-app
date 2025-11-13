import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetLoggedPasswordComponent } from './reset-logged-password.component';

describe('ResetLoggedPasswordComponent', () => {
  let component: ResetLoggedPasswordComponent;
  let fixture: ComponentFixture<ResetLoggedPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetLoggedPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetLoggedPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
