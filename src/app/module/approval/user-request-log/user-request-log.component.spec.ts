import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRequestLogComponent } from './user-request-log.component';

describe('UserRequestLogComponent', () => {
  let component: UserRequestLogComponent;
  let fixture: ComponentFixture<UserRequestLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRequestLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRequestLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
