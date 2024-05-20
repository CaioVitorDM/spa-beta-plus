import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetaGeneralComponent } from './beta-general.component';

describe('BetaGeneralComponent', () => {
  let component: BetaGeneralComponent;
  let fixture: ComponentFixture<BetaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetaGeneralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BetaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
