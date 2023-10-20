import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseUsageComponent } from './license-usage.component';

describe('LicenseUsageComponent', () => {
  let component: LicenseUsageComponent;
  let fixture: ComponentFixture<LicenseUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenseUsageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
