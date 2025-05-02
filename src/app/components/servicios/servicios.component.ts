import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Servicios } from './servicios.interface'

@Component({
  selector: 'app-servicios',
  imports: [CommonModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  services: Servicios[] = [
    { title: "SPA", info: "Disfruta de un hermoso masaje natural", image: 'images/spa.jpg' },
    { title: "Restaurant", info: "Las mejores comidas a toda hora", image: 'images/restaurant.jpg' },
    { title: "Gimnasio", info: "Un hermoso gimnasio con vista al mar", image: 'images/gimnasio.jpg' },
    { title: "Albercas", info: "Relajante, grandes y limpias", image: 'images/alberca.jpg' },
    { title: "Bar", info: "Nunca puede faltar una buena bebida", image: 'images/bar.jpg' },
    { title: "Salón de Eventos", info: "Salones para tus eventos especiales", image: 'images/salon.jpg' },
    { title: "Sala de Reuniones", info: "Para tus proyectos mientras te relajas", image: 'images/sala.jpg' },
    { title: "Lavandería", info: "Nosotros lavamos tus prendas, tu solo relajate", image: 'images/lavanderia.jpg' },
    { title: "Transporte", info: "Nosotros te llevamos por el agua", image: 'images/transpormar.jpg' }
  ];
}
