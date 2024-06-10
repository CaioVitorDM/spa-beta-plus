import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolDetailsComponent } from './protocol-details.component';

describe('ProtocolDetailsComponent', () => {
  let component: ProtocolDetailsComponent;
  let fixture: ComponentFixture<ProtocolDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtocolDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProtocolDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
