import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarmapComponent } from './starmap.component';

describe('StarmapComponent', () => {
  let component: StarmapComponent;
  let fixture: ComponentFixture<StarmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarmapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
