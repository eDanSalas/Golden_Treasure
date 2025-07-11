import { Component } from '@angular/core';
import { HabitacionService } from '../../services/habitacion.service';
import { Habitacion } from '../../habitacion';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { SearchComponent } from '../search/search.component';
import { RouterModule } from '@angular/router';
import { signal } from '@angular/core';
import { AccesibilityMenuComponent } from '../accesibility-menu/accesibility-menu.component';
import { ScreenReaderService } from '../../services/screen-reader.service';

@Component({
  selector: 'app-alojamiento',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, SearchComponent, RouterModule, MatIconModule, AccesibilityMenuComponent],
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
    ["fa-wifi", "fa-lock", "fa-tv", "fa-snowflake", "fa-wine-glass", "fa-umbrella-beach", "fa-shower", "fa-building-shield", "fa-desktop", "fa-phone"],
    ["fa-lock", "fa-tv", "fa-snowflake", "fa-wifi", "fa-phone"],
    ["fa-lightbulb", "fa-wifi", "fa-building-shield", "fa-temperature-high"],
    ["fa-wifi", "fa-shower", "fa-desktop", "fa-snowflake", "fa-lock"],
    ["fa-wifi", "fa-lightbulb", "fa-wine-glass", "fa-phone"],
    ["fa-wifi", "fa-snowflake", "fa-tv", "fa-desktop", "fa-umbrella-beach"],
    ["fa-wifi", "fa-wine-glass", "fa-temperature-high", "fa-lightbulb"],
    ["fa-lock", "fa-tv", "fa-shower", "fa-lightbulb"],
    ["fa-wifi", "fa-building-shield", "fa-phone", "fa-snowflake"],
    ["fa-wifi", "fa-wine-glass", "fa-snowflake", "fa-umbrella-beach"]
  ];
  habFiltradas: Habitacion[] = [];
  sinRes: boolean = false;

  loading = signal<boolean>(true);    //Señal de Angular 

  constructor(public habitacionService: HabitacionService, private reader: ScreenReaderService) {}

  ngOnInit(): void {
    this.recuperarHabitaciones();
    window.scrollTo({ top: 0 });

    this.loading.set(true); // Activamos Cargando al iniciar
    
    this.habitacionService.retornar().subscribe({
      next: (data) => {
        this.habitaciones = data.habitaciones;
        this.loading.set(false);    //Al encontrar Habitaciones desactivamos Cargando
      },
    });
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
      this.sinRes = this.habFiltradas.length === 0;
      return;
    }
    const normalizar = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const terminoNormalizado = normalizar(termino);
  
    this.habFiltradas = this.habitaciones.filter(habitacion => {
      const matchesTitle = normalizar(habitacion.titulo).includes(terminoNormalizado);
      const amenityIndex = (habitacion.id - 1) % this.amenidades.length;
      const matchesAmenities = this.amenidades[amenityIndex].some(icon =>
        normalizar(this.obtenerAmenidad(icon)).includes(terminoNormalizado)
      );
      return matchesTitle || matchesAmenities;
    });
    this.sinRes = this.habFiltradas.length === 0;
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
      "fa-wine-glass": "Mini Bar",
      "fa-umbrella-beach": "Balcón o Terraza",
      "fa-shower": "Detector de Humo",
      "fa-building-shield": "Edificio 100% libre de Humo",
      "fa-desktop": "Pantalla HD 42\"",
      "fa-temperature-high": "Secadora",
      "fa-phone": "Teléfono"
    };
    return nombres[icon] || "Amenidad";
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
