import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientComponent } from './pacient.component';

describe('PacientComponent', () => {
  let component: PacientComponent;
  let fixture: ComponentFixture<PacientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PacientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
