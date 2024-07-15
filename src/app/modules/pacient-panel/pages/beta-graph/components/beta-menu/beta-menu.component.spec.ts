import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetaMenuComponent } from './beta-menu.component';

describe('BetaMenuComponent', () => {
  let component: BetaMenuComponent;
  let fixture: ComponentFixture<BetaMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetaMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BetaMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
