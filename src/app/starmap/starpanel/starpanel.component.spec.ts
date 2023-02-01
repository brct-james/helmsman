import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarpanelComponent } from './starpanel.component';

describe('StarpanelComponent', () => {
  let component: StarpanelComponent;
  let fixture: ComponentFixture<StarpanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarpanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
