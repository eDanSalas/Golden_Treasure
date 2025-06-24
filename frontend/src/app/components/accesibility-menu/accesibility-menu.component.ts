import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ScreenReaderService } from '../../services/screen-reader.service';
import { CommonModule } from '@angular/common';
import { LectorPantallaComponent } from '../lector-pantalla/lector-pantalla.component';

@Component({
  selector: 'app-accesibility-menu',
  imports: [CommonModule, LectorPantallaComponent],
  templateUrl: './accesibility-menu.component.html',
  styleUrl: './accesibility-menu.component.css'
})
export class AccesibilityMenuComponent {
  @Input() position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';
  @Output() screenReaderToggled = new EventEmitter<boolean>();
  @Output() contrastToggled = new EventEmitter<boolean>();
  @Output() fontSizeChanged = new EventEmitter<number>();
  @Output() fontChanged = new EventEmitter<string>();
  @Output() colorFilterChanged = new EventEmitter<string | null>();

  menuOpen = false;
  screenReaderActive = false;
  highContrastActive = false;
  fontSize: number = 0; // -1: pequeño, 0: normal, 1: grande
  currentFont: number = 0; // 0: default, 1: sans-serif, 2: serif, 3: monospace

   // Propiedad para controlar la visibilidad del lector de pantalla
  showScreenReader = false;

  // Propiedades para el lector de pantalla
  readerActive = false;
  readerPaused = false;

  // Propiedades para el control del filtro de daltonismo
  colorFilterActive = false;
  currentFilter: string | null = null;

  constructor(private readerService: ScreenReaderService) { }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleScreenReader() {
    this.screenReaderActive = !this.screenReaderActive;
    this.showScreenReader = this.screenReaderActive;
    this.screenReaderToggled.emit(this.screenReaderActive);
    if (this.screenReaderActive) {
      this.readerService.activarLector();
    } else {
      this.readerService.desactivarLector();
    }
  }

  toggleContrast() {
    this.highContrastActive = !this.highContrastActive;
    this.contrastToggled.emit(this.highContrastActive);
  }

  adjustFontSize(step: number) {
    this.fontSize = Math.max(-1, Math.min(1, this.fontSize + step));
    // this.fontSize = Math.max(80, Math.min(150, this.fontSize + step * 10));
    this.fontSizeChanged.emit(this.fontSize);
  }

  cycleFont() {
    this.currentFont = (this.currentFont + 1) % 4;
    const fonts = ['default', 'sans-serif', 'serif', 'monospace'];
    this.fontChanged.emit(fonts[this.currentFont]);
    document.body.style.fontFamily = fonts[this.currentFont];

  }

  getPositionClass() {
    return {
      'top-right': this.position === 'top-right',
      'top-left': this.position === 'top-left',
      'bottom-right': this.position === 'bottom-right',
      'bottom-left': this.position === 'bottom-left'
    };
  }

  // Métodos para controlar el lector de pantalla
  iniciarLecturaSeccion(sectionId: string) {
    this.readerActive = true;
    this.readerPaused = false;
    console.log(`Iniciando lectura de la sección: ${sectionId}`);
  }

  pausarLectura() {
    if (this.readerActive && !this.readerPaused) {
      this.readerPaused = true;
      console.log('Lectura pausada');
    }
  }

  continuarLectura() {
    if (this.readerActive && this.readerPaused) {
      this.readerPaused = false;
      console.log('Continuando lectura');
    }
  }

  detenerLectura() {
    if (this.readerActive) {
      this.readerActive = false;
      this.readerPaused = false;
      console.log('Lectura detenida');
    }
  }

  // Metodos para manejo de filtro
  toggleColorFilter() {
    this.colorFilterActive = !this.colorFilterActive;

    if (!this.colorFilterActive && this.currentFilter) {
      this.setColorFilter(null);
    }

  }

  setColorFilter(filter: string | null) {
    this.currentFilter = filter;
    this.colorFilterChanged.emit(filter);

    if (filter) {
      this.colorFilterActive = true;
    }
  }

  // Cerrar el menú al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.accessibility-container') && this.menuOpen) {
      this.menuOpen = false;
    }
  }
}
