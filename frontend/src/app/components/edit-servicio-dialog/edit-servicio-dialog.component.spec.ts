import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServicioDialogComponent } from './edit-servicio-dialog.component';

describe('EditServicioDialogComponent', () => {
  let component: EditServicioDialogComponent;
  let fixture: ComponentFixture<EditServicioDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditServicioDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditServicioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
