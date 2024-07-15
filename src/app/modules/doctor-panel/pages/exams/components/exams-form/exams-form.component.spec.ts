import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamsFormComponent } from './exams-form.component';

describe('ExamsFormComponent', () => {
  let component: ExamsFormComponent;
  let fixture: ComponentFixture<ExamsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExamsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
