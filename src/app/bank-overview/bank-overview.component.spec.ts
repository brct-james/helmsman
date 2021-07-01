import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankOverviewComponent } from './bank-overview.component';

describe('BankOverviewComponent', () => {
  let component: BankOverviewComponent;
  let fixture: ComponentFixture<BankOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
