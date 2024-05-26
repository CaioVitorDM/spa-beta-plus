import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProtocolComponent } from './edit-protocol.component';

describe('EditProtocolComponent', () => {
  let component: EditProtocolComponent;
  let fixture: ComponentFixture<EditProtocolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProtocolComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditProtocolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
