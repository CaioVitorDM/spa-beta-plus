import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetaPopUpComponent } from './beta-pop-up.component';

describe('BetaPopUpComponent', () => {
  let component: BetaPopUpComponent;
  let fixture: ComponentFixture<BetaPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetaPopUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BetaPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
