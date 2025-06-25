import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { ServicioRegistrado } from './servicioRegistrado';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-edit-servicio-dialog',
  imports: [MatDialogActions, MatInputModule, MatLabel, MatFormField, MatDialogContent, FormsModule, MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule
  ],
  templateUrl: './edit-servicio-dialog.component.html',
  styleUrl: './edit-servicio-dialog.component.css'
})
export class EditServicioDialogComponent {
  servicio: any;
  minFecha = new Date();
  modelo = {
    nombre: '',
    nombrePublico: '',
    email: '',
    duda: '',
    aceptaFAQ: false,
    fechaParticular: null,
    cuentaReservacion: ''
  };

  constructor(
    public dialogRef: MatDialogRef<EditServicioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.servicio = { ...data.servicio }; // Copia del servicio original
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.servicio);
  }
}
