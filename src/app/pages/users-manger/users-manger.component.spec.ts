import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersMangerComponent } from './users-manger.component';

describe('UsersMangerComponent', () => {
  let component: UsersMangerComponent;
  let fixture: ComponentFixture<UsersMangerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersMangerComponent]
    });
    fixture = TestBed.createComponent(UsersMangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
