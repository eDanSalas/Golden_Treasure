import { Component, ViewChild } from '@angular/core';
import { Comentario } from '../../comentario';
import { ComentarioService } from '../../services/comentario.service';
import { CommonModule } from '@angular/common';
import { AccesibilityMenuComponent } from '../accesibility-menu/accesibility-menu.component';
import { ScreenReaderService } from '../../services/screen-reader.service';

@Component({
  selector: 'app-comentarios',
  imports: [CommonModule, AccesibilityMenuComponent],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent {
  comentarios: Comentario[] = [];

  constructor(private comentarioService: ComentarioService, private reader: ScreenReaderService) {}

  ngOnInit(): void {
    this.comentarios = this.comentarioService.getComments();
    window.scrollTo({ top: 0 });
  }

  formatFecha(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  getStars(puntuacion: number): any[] {
    return Array(5).fill(0).map((_, index) => ({
      filled: index < puntuacion
    }));
  }
  
  // constructor(private miservicio: ComentarioService) { 
  //   console.log("constructor de comentarios");
  // }

  // formatFecha(fechaStr: string): string {
  //   const fecha = new Date(fechaStr);
  //   const opciones: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  //   return fecha.toLocaleDateString("es-ES", opciones);
  // }


  // ngOnInit(): void {
  //   console.log("ngOnInit comentarios");
  //   this.comentarios = this.miservicio.getComments();
  //   console.log(this.comentarios);
  //   window.scrollTo({ top: 0 });
  // }

  // Funciones para accesibilidad

  @ViewChild('carousel') carousel: any;
  currentSlideIndex = 0;

  onSlideChange(event: any) {
    this.currentSlideIndex = event.to;
    this.announceCurrentSlide();
  }

  announceCurrentSlide() {
    const rev_date = this.formatFecha(this.comentarios[this.currentSlideIndex].rev_date);
    console.log(rev_date);
    if (this.reader.lectorActivo && this.comentarios[this.currentSlideIndex]) {
      this.reader.speak(this.comentarios[this.currentSlideIndex].nombre + 
      "fecha " + rev_date +
      "calificacion " + this.comentarios[this.currentSlideIndex].rating.toString() +
      this.comentarios[this.currentSlideIndex].review
    );
      
    }
  }

  readCurrentOffer() {
    this.announceCurrentSlide();
  }

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
