import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProtocolComponent } from './create-protocol.component';

describe('CreateProtocolComponent', () => {
  let component: CreateProtocolComponent;
  let fixture: ComponentFixture<CreateProtocolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProtocolComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateProtocolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
