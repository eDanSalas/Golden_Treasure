import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReservasDialogComponent } from './edit-reservas-dialog.component';

describe('EditReservasDialogComponent', () => {
  let component: EditReservasDialogComponent;
  let fixture: ComponentFixture<EditReservasDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReservasDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReservasDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
