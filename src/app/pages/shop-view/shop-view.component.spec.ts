import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopViewComponent } from './shop-view.component';

describe('ShopViewComponent', () => {
  let component: ShopViewComponent;
  let fixture: ComponentFixture<ShopViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ShopViewComponent]
    });
    fixture = TestBed.createComponent(ShopViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
