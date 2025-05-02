import { Component } from '@angular/core';
import { HabitacionService } from '../../services/habitacion.service';
import { Habitacion } from '../../habitacion';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-alojamiento',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, SearchComponent],
  templateUrl: './alojamiento.component.html',
  styleUrl: './alojamiento.component.css'
})
export class AlojamientoComponent {
  habitaciones: Habitacion[] = [];
  habImage: {[key: number]: string[]} = {
    1: ["images/h1-1.jpg","images/h1-2.jpg","images/h1-3.jpg"],
    2: ["images/h2-1.jpg","images/h2-2.jpg","images/h2-3.jpg"],
    3: ["images/h3-1.jpg","images/h3-2.jpg","images/h3-3.jpg"],
    4: ["images/h4-1.jpg","images/h4-2.jpg","images/h4-3.jpg"],
    5: ["images/h5-1.jpg","images/h5-2.jpg","images/h5-3.jpg"],
    6: ["images/h6-1.jpg","images/h6-2.jpg","images/h6-3.jpg"],
    7: ["images/h7-1.jpg","images/h7-2.jpg","images/h7-3.jpg"],
    8: ["images/h8-1.jpg","images/h8-2.jpg","images/h8-3.jpg"],
    9: ["images/h9-1.webp","images/h9-2.webp","images/h9-3.webp"],
    10:["images/h10-1.webp","images/h10-2.webp","images/h10-3.webp"], 
  };
  amenidades: string[][] =[
    ["fa-wifi","fa-lock", "fa-tv", "fa-snowflake", "fa-lightbulb", "fa-wine-glass"],
    ["fa-wifi", "fa-snowflake", "fa-lightbulb", "fa-wine-glass"],
    ["fa-wifi","fa-lock"],
    ["fa-wifi","fa-lock", "fa-tv", "fa-lightbulb"],
  ];
  habFiltradas: Habitacion[] = [];


  constructor(public habitacionService: HabitacionService) {}

  ngOnInit(): void {
    this.recuperarHabitaciones();
  }

  recuperarHabitaciones(): void {
    this.habitacionService.retornar().subscribe({
      next: (response: { habitaciones: Habitacion[] }) => {
        this.habitaciones = response.habitaciones;
        this.habFiltradas = [...response.habitaciones];
      },
      error: (err) => console.error('Error cargando habitaciones:', err)
    });
  }

  onSearch(termino: string): void {
    if (!termino) {
      this.habFiltradas = [...this.habitaciones];
      return;
    }

    this.habFiltradas = this.habitaciones.filter(habitacion => {
      const matchesTitle = habitacion.titulo.toLowerCase().includes(termino);
      const amenityIndex = (habitacion.id - 1) % this.amenidades.length;
      const matchesAmenities = this.amenidades[amenityIndex].some(icon => 
        this.obtenerAmenidad(icon).toLowerCase().includes(termino)
      );
      return matchesTitle || matchesAmenities;
    });
  }

  successRequest(data: any): void {
    console.log(data);
    this.habitaciones = data.habitaciones;
  }

  obtenerAmenidad(icon: string): string {
    const nombres: { [key: string]: string } = {
      "fa-wifi": "WIFI",
      "fa-lock": "Caja Fuerte",
      "fa-tv": "Cable / Satélite",
      "fa-snowflake": "Aire Acondicionado",
      "fa-lightbulb": "Lámparas con USB",
      "fa-wine-glass": "Mini Bar"
    };
    return nombres[icon] || "Amenidad";
  }
}
