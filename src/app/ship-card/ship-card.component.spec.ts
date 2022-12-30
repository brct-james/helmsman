import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipCardComponent } from './ship-card.component';

describe('ShipCardComponent', () => {
  let component: ShipCardComponent;
  let fixture: ComponentFixture<ShipCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
