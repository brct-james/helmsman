import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipDetailsComponent } from './ship-details.component';

describe('ShipDetailsComponent', () => {
  let component: ShipDetailsComponent;
  let fixture: ComponentFixture<ShipDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
