import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetaDateFilterComponent } from './beta-date-filter.component';

describe('BetaDateFilterComponent', () => {
  let component: BetaDateFilterComponent;
  let fixture: ComponentFixture<BetaDateFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetaDateFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BetaDateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
