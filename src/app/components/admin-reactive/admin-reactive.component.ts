import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
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

  // eliminarRegistro(index: number) {
  //     if (index >= 0 && index < this.reservaciones.length) {
  //       this.reservaciones.splice(index, 1);
  //       localStorage.setItem('reservaciones', JSON.stringify(this.reservaciones));
  //       this.eliminarReservacion.emit(index);
  //     }
  // }

  abrirDialogoEdicion(index: number) {
    const dialogRef = this.dialog.open(EditReservasDialogComponent, {
      width: '500px',
      data: { ...this.reservaciones[index] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {        
        let auxDate = result.inicio;
        let año = auxDate.getFullYear();
        let mes = String(auxDate.getMonth() + 1).padStart(2, '0'); // Meses van de 0-11
        let dia = String(auxDate.getDate()).padStart(2, '0');

        result.inicio = `${año}-${mes}-${dia}`;
        
        auxDate = result.fin;
        año = auxDate.getFullYear();
        mes = String(auxDate.getMonth() + 1).padStart(2, '0'); // Meses van de 0-11
        dia = String(auxDate.getDate()).padStart(2, '0');

        result.fin = `${año}-${mes}-${dia}`;
        this.editarReservacion.emit({ index: this.reservaciones[index].no_reservacion , reservacion: result });
      }
    });
  }
  

}
