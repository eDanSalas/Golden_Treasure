import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagReservacionComponent } from './pag-reservacion.component';

describe('PagReservacionComponent', () => {
  let component: PagReservacionComponent;
  let fixture: ComponentFixture<PagReservacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagReservacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagReservacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
