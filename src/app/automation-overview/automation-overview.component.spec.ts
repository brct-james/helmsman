import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationOverviewComponent } from './automation-overview.component';

describe('AutomationOverviewComponent', () => {
  let component: AutomationOverviewComponent;
  let fixture: ComponentFixture<AutomationOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomationOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
