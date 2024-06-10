import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolsCardComponent } from './protocols-card.component';

describe('ProtocolsCardComponent', () => {
  let component: ProtocolsCardComponent;
  let fixture: ComponentFixture<ProtocolsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtocolsCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProtocolsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
