import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SafeurlPipe } from '../../pipes/safeurl.pipe';
import { MatExpansionModule } from '@angular/material/expansion';
import { ScreenReaderService } from '../../services/screen-reader.service';
import { AccesibilityMenuComponent } from '../accesibility-menu/accesibility-menu.component';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, SafeurlPipe,MatExpansionModule, AccesibilityMenuComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  videoUrl: string = 'Hotel-video.mp4';
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  // Estado de accesibilidad
  isHighContrast = false;
  fontSize: number = 0; // -1: pequeño, 0: normal, 1: grande
  currentFont: string = 'default';

  constructor(private reader: ScreenReaderService) { };

  ngAfterViewInit() {
    const video = this.videoPlayer.nativeElement;
    video.load(); 
    video.muted = true;
    video.play().catch(error => {
      console.warn('Error al reproducir:', error);
    });
    window.scrollTo({ top: 0 });
  }
  
  onRightClick(event: MouseEvent): void {
    event.preventDefault(); 
  }

  preguntas = [
    {pregunta: "¿A qué hora es el check-in y check-out?", respuesta: "El check-in es a partir de las 3:00 PM y el check-out a las 12:00 PM."},
    {pregunta: "¿Se admiten mascotas?", respuesta: "Si se admiten mascotas en el hotel con un costo extra"},
    {pregunta: "¿Cuál es el código de vestimenta de los restaurantes?", respuesta: "El código de vestimenta de los restaurantes es casual. Se permite pantalones o bermudas, camisas de vestir y sandalias formales. No está permitido el uso de ropa mojada, bañador ni chanclas"},
    {pregunta: "¿A qué distancia está el hotel del aeropuerto?", respuesta: "El hotel se encuentra a 15 minutos del Aeropuerto Internacional de Guayabitos."},
    {pregunta: "¿Se puede fumar en las habitaciones?", respuesta: "No se puede fumar dentro de las habitaciones, ya que se le cobrará una sanción económica. Puede fumar en los espacios designados."},
    {pregunta: "¿Qué sucede si se presenta algún accidente en la piscina?", respuesta: "Dependiendo del nivel del accidente se realizarán acciones para mantener la integridad y la salud de las personas involucradas. En caso de algún daño al área de la piscina puede repercutir en una sanción económica."},
  ]

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
