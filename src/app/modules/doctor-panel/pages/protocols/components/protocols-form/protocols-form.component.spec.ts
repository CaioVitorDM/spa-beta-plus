import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolsFormComponent } from './protocols-form.component';

describe('ProtocolsFormComponent', () => {
  let component: ProtocolsFormComponent;
  let fixture: ComponentFixture<ProtocolsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtocolsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProtocolsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
