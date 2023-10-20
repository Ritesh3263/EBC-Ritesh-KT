import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalDoneComponent } from './approval-done.component';

describe('ApprovalDoneComponent', () => {
  let component: ApprovalDoneComponent;
  let fixture: ComponentFixture<ApprovalDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalDoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
