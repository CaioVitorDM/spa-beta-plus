import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetaEditComponent } from './beta-edit.component';

describe('BetaEditComponent', () => {
  let component: BetaEditComponent;
  let fixture: ComponentFixture<BetaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetaEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BetaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
