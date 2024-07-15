import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBetaComponent } from './view-beta.component';

describe('ViewBetaComponent', () => {
  let component: ViewBetaComponent;
  let fixture: ComponentFixture<ViewBetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBetaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewBetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
