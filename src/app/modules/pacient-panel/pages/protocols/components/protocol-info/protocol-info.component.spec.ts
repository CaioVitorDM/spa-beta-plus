import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolInfoComponent } from './protocol-info.component';

describe('ProtocolInfoComponent', () => {
  let component: ProtocolInfoComponent;
  let fixture: ComponentFixture<ProtocolInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtocolInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProtocolInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
