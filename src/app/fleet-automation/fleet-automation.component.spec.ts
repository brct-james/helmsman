import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetAutomationComponent } from './fleet-automation.component';

describe('FleetAutomationComponent', () => {
  let component: FleetAutomationComponent;
  let fixture: ComponentFixture<FleetAutomationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FleetAutomationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetAutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
