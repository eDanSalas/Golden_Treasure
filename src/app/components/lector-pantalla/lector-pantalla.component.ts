import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScreenReaderService } from '../../services/screen-reader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lector-pantalla',
  imports: [CommonModule],
  templateUrl: './lector-pantalla.component.html',
  styleUrl: './lector-pantalla.component.css'
})
export class LectorPantallaComponent {
  @Input() sectionId: string = 'main-content'; // ID de la sección a leer por defecto
  @Output() iniciarLectura = new EventEmitter<string>();
  // @Output() activarLector = new EventEmitter<boolean>();
  @Output() pausarLectura = new EventEmitter<void>();
  @Output() continuarLectura = new EventEmitter<void>();
  @Output() detenerLectura = new EventEmitter<void>();

  estado: 'inactivo' | 'leyendo' | 'pausado' = 'inactivo';

  constructor(private reader: ScreenReaderService) { }

  iniciar() {
    this.iniciarLectura.emit(this.sectionId);
    const section = document.getElementById(this.sectionId);
    if (section) {
      const text = section.innerText;
      this.reader.speak(text);
    }
    this.estado = 'leyendo';
  }

  iniciarLecturaSeccion() {
    if (this.sectionId) {
      this.iniciarLectura.emit(this.sectionId);
    }
  }

  pausar() {
    this.pausarLectura.emit();
    this.estado = 'pausado';
    this.reader.pause();
  }

  continuar() {
    this.continuarLectura.emit();
    this.estado = 'leyendo';
    this.reader.resume();
  }

  detener() {
    this.detenerLectura.emit();
    this.estado = 'inactivo';
    this.reader.stop();
  }

  getEstadoClass() {
    return {
      'inactivo': this.estado === 'inactivo',
      'leyendo': this.estado === 'leyendo',
      'pausado': this.estado === 'pausado'
    };
  }
}
