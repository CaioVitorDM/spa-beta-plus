import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamsTableConventionalComponent } from './exams-table-conventional.component';

describe('ExamsTableConventionalComponent', () => {
  let component: ExamsTableConventionalComponent;
  let fixture: ComponentFixture<ExamsTableConventionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamsTableConventionalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExamsTableConventionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
