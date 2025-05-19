import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeDrawerComponent } from './shape-drawer.component';

describe('ShapeDrawerComponent', () => {
  let component: ShapeDrawerComponent;
  let fixture: ComponentFixture<ShapeDrawerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ShapeDrawerComponent]
    });
    fixture = TestBed.createComponent(ShapeDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
