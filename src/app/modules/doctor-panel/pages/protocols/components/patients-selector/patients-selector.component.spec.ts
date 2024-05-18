import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsSelectorComponent } from './patients-selector.component';

describe('PatientsSelectorComponent', () => {
  let component: PatientsSelectorComponent;
  let fixture: ComponentFixture<PatientsSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientsSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
