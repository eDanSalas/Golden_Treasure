import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AdminReactiveComponent } from '../admin-reactive/admin-reactive.component';
import { DataBaseService } from '../../services/data-base.service';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG  } from 'ngx-echarts';
import * as echarts from 'echarts';
import { AccesibilityMenuComponent } from '../accesibility-menu/accesibility-menu.component';
import { ScreenReaderService } from '../../services/screen-reader.service';

@Component({
  selector: 'app-dashboard',
  imports: [AdminComponent, AdminReactiveComponent, CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, NgxEchartsModule, AccesibilityMenuComponent],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: {
        echarts
      }
    }
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  id!: number;  
  isActive = false;

  adminName: string = '';

  admin: {[key: number]: string} = {
    1: "Ángel Daniel Lopez Rodriguez",
    2: "Eric Daniel Salas Martínez",
    3: "Diego Adriel Segura Ramírez"
  }


  servicios: any[] = [];
  reservaciones: any[] = [];
  chartData: any[] = [
    {value:0, name: "Suite Presidencial"},
    {value:0, name: "Suite Deluxe"},
    {value:0, name: "Habitación Temática"},
    {value:0, name: "Habitación con Piscina"},
    {value:0, name: "Mini Departamento"},
    {value:0, name: "Loft Moderno"},
    {value:0, name: "Habitación con Vista a la Playa"},
    {value:0, name: "Habitación Estándar"},
    {value:0, name: "Habitación Romántica"},
    {value:0, name: "Habitación Familiar"}
  ];

  //configuración del gráfico
  chartOptions = {
    color: ['#F2CE00', '#E6C717', '#D9BB16', '#CCB429', '#BFA826', '#B3A036', '#A69432', '#998B3D', '#8C8038', '#807640'],
    title: {
      text: 'Distribución de habitaciones',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: '0%',
      left: 'center',
    },
    series: [
      {
        name: 'Habitaciones',
        type: 'pie',
        radius: [30, 120],
        roseType: 'area',
        data: this.chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  constructor(public route: ActivatedRoute, private storageService: StorageService, private dbService: DataBaseService, private reader: ScreenReaderService) {
    this.storageService.getServicios().subscribe((data: any[]) => {
      this.servicios = data.sort((a, b) => a.no_servicio - b.no_servicio);
    });
    this.storageService.getReservaciones().subscribe((data: any[]) => {
      this.reservaciones = data.sort((a, b) => a.no_reservacion - b.no_reservacion);
    });
    this.updateChart();
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.loadAdminData();
    this.actualizarLista();
    window.scrollTo({ top: 0 });
  }

  loadAdminData() {
    this.dbService.getAllAdmins().subscribe({
      next: (admins) => {
        const foundAdmin = admins.find((admin: any) => admin.id === this.id);
        if (foundAdmin) {
          this.adminName = foundAdmin.nombre;
        }
        this.actualizarLista();
      },
      error: (err) => {
        console.error('Error al cargar admin:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la información del administrador',
          icon: 'error',
          confirmButtonColor: 'gold',
          background: '#1e1e1e',
          color: 'white'
        });
      }
    });
  }

  actualizarLista() {
    this.storageService.getServicios().subscribe((data: any[]) => {
      this.servicios = data.sort((a, b) => a.no_servicio - b.no_servicio);
    });
    this.storageService.getReservaciones().subscribe((data: any[]) => {
      this.reservaciones = data.sort((a, b) => a.no_reservacion - b.no_reservacion);
    });
    this.updateChart();
  }

  eliminarServicio(index: number) {
    this.storageService.eliminarServicio(index);
    this.storageService.getServicios().subscribe(data => {
      this.servicios = [...data.sort((a, b) => a.no_servicio - b.no_servicio)];
      Swal.fire({
        title: 'Registro eliminado',
        icon: 'success',
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      });
      this.actualizarLista();
    });
  }

  editarServicio(evento: {index: number, servicio: any}) {
    this.storageService.editarServicios(evento.index, evento.servicio);
    this.storageService.getServicios().subscribe(data => {
      this.servicios = [...data.sort((a, b) => a.no_servicio - b.no_servicio)];
      Swal.fire({
        title: 'Registro editado',
        icon: 'success',
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      });
      this.actualizarLista();
    });
  }

  eliminarReservacion(index: number) {
    this.storageService.eliminarReservaciones(index);
    this.storageService.getReservaciones().subscribe(data => {
      this.reservaciones = [...data.sort((a, b) => a.no_reservacion - b.no_reservacion)];

      Swal.fire({
        title: 'Registro eliminado',
        icon: 'success',
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      });

      this.actualizarLista();
    });
  }

  editarReservacion(evento: {index: number, reservacion: any}) {
    this.storageService.editarReservaciones(evento.index, evento.reservacion);
    // this.reservaciones = [...this.storageService.getReservaciones()];
    this.storageService.getReservaciones().subscribe(data => {
      this.reservaciones = data.slice().sort((a, b) => a.no_reservacion - b.no_reservacion);
      
      Swal.fire({
        title: 'Registro editado',
        icon: 'success',
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      });

      this.actualizarLista();
    });
  }

  toggleActive() {
    this.isActive = !this.isActive;
  }
  
  updateChart(){
    this.chartData.forEach(item => {
      const nombreNormalizado = item.name.toLowerCase();
      item.value = this.reservaciones.filter(r => r.habitacion.toLowerCase() === nombreNormalizado).length;
    });
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
