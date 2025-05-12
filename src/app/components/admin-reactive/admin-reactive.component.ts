import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EditServicioDialogComponent } from '../edit-servicio-dialog/edit-servicio-dialog.component';
import { EditReservasDialogComponent } from '../edit-reservas-dialog/edit-reservas-dialog.component';

@Component({
  selector: 'app-admin-reactive',
  imports: [MatIconModule, MatButtonModule, MatTableModule, MatNativeDateModule, CommonModule],
  templateUrl: './admin-reactive.component.html',
  styleUrl: './admin-reactive.component.css'
})
export class AdminReactiveComponent {
  @Input() reservaciones: any[] = [];
  @Output() eliminarReservacion = new EventEmitter<number>();
  @Output() editarReservacion = new EventEmitter<{index:number, reservacion: any}>();

  constructor(private dialog: MatDialog) {}

  displayedColumns: string[] = [
    'nombre',
    'email',
    'extras',
    'fechaFin',
    'fechaInicio',
    'hab',
    'huespedes',
    'noches',
    'telefono',
    'tipoReserva',
    'total',
    'acciones'
  ];

  highlightedRowIndex: number | null = null;
  hoveredRowIndex: number | null = null;

  setHoveredRow(index: number) {
    this.hoveredRowIndex = index;
  }

  clearHoveredRow() {
    this.hoveredRowIndex = null;
  }

  toggleSelectedRow(index: number) {
    this.highlightedRowIndex = (this.highlightedRowIndex === index) ? null : index;
  }

  abrirDialogoEdicion(index: number): void {
    const dialogRef = this.dialog.open(EditReservasDialogComponent, {
      width: '400px',
      data: { reservacion: this.reservaciones[index] }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.editarReservacion.emit({ index, reservacion: result });
      }
    });
  }
  

}
