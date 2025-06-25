import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectorPantallaComponent } from './lector-pantalla.component';

describe('LectorPantallaComponent', () => {
  let component: LectorPantallaComponent;
  let fixture: ComponentFixture<LectorPantallaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectorPantallaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LectorPantallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
