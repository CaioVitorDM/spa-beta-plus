import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolsTableComponent } from './protocols-table.component';

describe('ProtocolsTableComponent', () => {
  let component: ProtocolsTableComponent;
  let fixture: ComponentFixture<ProtocolsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtocolsTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProtocolsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
