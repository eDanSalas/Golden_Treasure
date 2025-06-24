import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServicioService } from '../../services/servicio.service';
import { Servicios } from './servicios.interface';
import { RouterModule } from '@angular/router';
import { AccesibilityMenuComponent } from '../accesibility-menu/accesibility-menu.component';
import { ScreenReaderService } from '../../services/screen-reader.service';

@Component({
  selector: 'app-servicios',
  imports: [CommonModule, MatProgressSpinnerModule, RouterModule, AccesibilityMenuComponent],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  losServicios: Servicios[] = [];

  constructor(public service: ServicioService, public reader: ScreenReaderService) {

  }

  ngOnInit() {
    this.losServicios = this.service.getServicios();
    window.scrollTo({ top: 0 });
  }

  // Funciones para accesibilidad

  leerCard(titulo: string, texto: string) {
    const mensaje = `${titulo}. ${texto}`;
    this.reader.speak(mensaje);
  }

  leerPregunta(pregunta: string, respuesta: string) {
    const textoPlano = this.stripHtmlTags(respuesta);
    this.reader.speak(`${pregunta}. ${textoPlano}`);
  }

  stripHtmlTags(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  handleContrastToggle(active: boolean) {
    document.body.classList.toggle('high-contrast', active);
  }

  applyColorFilter(filter: string | null) {
    document.body.classList.remove(
      'color-filter-protanopia',
      'color-filter-deuteranopia',
      'color-filter-tritanopia'
    );
    if (filter) {
      document.body.classList.add(`color-filter-${filter}`);
    }
  }

  handleFontSizeChange(size: number) {
    document.body.classList.remove('small-text', 'large-text');
    if (size === 1) {
      document.body.classList.add('large-text');
    } else if (size === -1) {
      document.body.classList.add('small-text');
    }
  }

  handleFontChange(font: string) {
    document.body.classList.remove('sans-serif', 'serif', 'monospace');
    if (font !== 'default') {
      document.body.classList.add(font);
    }
  }
}
