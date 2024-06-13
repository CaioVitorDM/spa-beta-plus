import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExamsComponent } from './edit-exams.component';

describe('EditExamsComponent', () => {
  let component: EditExamsComponent;
  let fixture: ComponentFixture<EditExamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExamsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
