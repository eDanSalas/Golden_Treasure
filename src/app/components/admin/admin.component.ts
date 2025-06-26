import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EditServicioDialogComponent } from '../edit-servicio-dialog/edit-servicio-dialog.component';

@Component({
  selector: 'app-admin',
  imports: [MatIconModule, MatButtonModule, MatTableModule, MatNativeDateModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  @Input() servicios: any[] = [];
  @Output() eliminarServicio = new EventEmitter<number>();
  @Output() editarServicio = new EventEmitter<{index:number, servicio: any}>();

  constructor(private dialog: MatDialog) {}

  displayedColumns: string[] = [
    'position',
    'nombre',
    'nombrePublico',
    'email',
    'extra',
    'fecha',
    'reservacion',
    'aceptacion',
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
    const dialogRef = this.dialog.open(EditServicioDialogComponent, {
      width: '400px',
      data: { servicio: this.servicios[index] }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let auxDate = result.fecha;
        let año = auxDate.getFullYear();
        let mes = String(auxDate.getMonth() + 1).padStart(2, '0'); // Meses van de 0-11
        let dia = String(auxDate.getDate()).padStart(2, '0');

        result.fecha = `${año}-${mes}-${dia}`;
        this.editarServicio.emit({ index: this.servicios[index].no_servicio, servicio: result });
      }
    });
  }
  

}