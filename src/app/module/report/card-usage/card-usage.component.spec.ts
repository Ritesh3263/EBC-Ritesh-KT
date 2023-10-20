import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardUsageComponent } from './card-usage.component';

describe('CardUsageComponent', () => {
  let component: CardUsageComponent;
  let fixture: ComponentFixture<CardUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardUsageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
