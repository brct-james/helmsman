import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipAutomationControlsComponent } from './ship-automation-controls.component';

describe('ShipAutomationControlsComponent', () => {
  let component: ShipAutomationControlsComponent;
  let fixture: ComponentFixture<ShipAutomationControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipAutomationControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipAutomationControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
