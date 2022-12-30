import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetSettingsComponent } from './fleet-settings.component';

describe('FleetSettingsComponent', () => {
  let component: FleetSettingsComponent;
  let fixture: ComponentFixture<FleetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FleetSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FleetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
