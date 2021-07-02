import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructuresOverviewComponent } from './structures-overview.component';

describe('StructuresOverviewComponent', () => {
  let component: StructuresOverviewComponent;
  let fixture: ComponentFixture<StructuresOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StructuresOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StructuresOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
