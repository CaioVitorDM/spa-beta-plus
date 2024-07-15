import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetaDetailsComponent } from './beta-details.component';

describe('BetaDetailsComponent', () => {
  let component: BetaDetailsComponent;
  let fixture: ComponentFixture<BetaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BetaDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BetaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
