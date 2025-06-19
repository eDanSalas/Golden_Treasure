import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SafeurlPipe } from '../../pipes/safeurl.pipe';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, SafeurlPipe,MatExpansionModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  videoUrl: string = 'Hotel-video.mp4';
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

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
}
