import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetaGraphComponent } from './beta-graph.component';

describe('BetaGraphComponent', () => {
  let component: BetaGraphComponent;
  let fixture: ComponentFixture<BetaGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetaGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BetaGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
