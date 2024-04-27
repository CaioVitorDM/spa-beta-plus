import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientPanelComponent } from './pacient-panel.component';

describe('PacientPanelComponent', () => {
  let component: PacientPanelComponent;
  let fixture: ComponentFixture<PacientPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacientPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PacientPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
