import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerOverviewComponent } from './ledger-overview.component';

describe('LedgerOverviewComponent', () => {
  let component: LedgerOverviewComponent;
  let fixture: ComponentFixture<LedgerOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LedgerOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LedgerOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
