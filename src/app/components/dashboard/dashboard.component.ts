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
import { lastValueFrom } from 'rxjs';

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

  constructor(public route: ActivatedRoute, private storageService: StorageService, private dbService: DataBaseService, private reader: ScreenReaderService) { }

  async ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.loadAdminData();
    await this.actualizarLista();
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

  async actualizarLista() {
    try {
      const [servicios, reservaciones] = await Promise.all([
        lastValueFrom(this.storageService.getServicios()),
        lastValueFrom(this.storageService.getReservaciones())
      ]);
      
      this.servicios = servicios.sort((a, b) => a.no_servicio - b.no_servicio);
      this.reservaciones = reservaciones.sort((a, b) => a.no_reservacion - b.no_reservacion);
      this.updateChart();
    } catch (err) {
      console.error('Error al cargar datos:', err);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los datos',
        icon: 'error',
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      });
    }
  }

  async eliminarServicio(index: number) {
    try {
      await lastValueFrom(this.storageService.eliminarServicio(this.servicios[index].no_servicio));
      const data = await lastValueFrom(this.storageService.getServicios());
      this.servicios = data.sort((a, b) => a.no_servicio - b.no_servicio);
      this.updateChart();
      Swal.fire({
        title: 'Registro eliminado',
        icon: 'success',
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      });
    } catch (err) {
      console.error('Error al eliminar:', err);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el registro',
        icon: 'error',
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      });
    }
  }

  async editarServicio(evento: {index: number, servicio: any}) {
    try {
      await lastValueFrom(this.storageService.editarServicios(evento.index, evento.servicio));
      const data = await lastValueFrom(this.storageService.getServicios());
      this.servicios = data.sort((a, b) => a.no_servicio - b.no_servicio);
      this.updateChart();
      Swal.fire({
        title: 'Registro editado',
        icon: 'success',
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      });
    } catch (err) {
      console.error('Error al editar:', err);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo editar el registro',
        icon: 'error',
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      });
    }
  }

  async eliminarReservacion(index: number) {
    try {
      await lastValueFrom(this.storageService.eliminarReservaciones(this.reservaciones[index].no_reservacion));
      const data = await lastValueFrom(this.storageService.getReservaciones());
      this.reservaciones = data.sort((a, b) => a.no_reservacion - b.no_reservacion);
      this.updateChart();
      Swal.fire({
        title: 'Registro eliminado',
        icon: 'success',
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      });
    } catch (err) {
      console.error('Error al eliminar:', err);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el registro',
        icon: 'error',
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      });
    }
  }

  async editarReservacion(evento: {index: number, reservacion: any}) {
    try {
      await lastValueFrom(this.storageService.editarReservaciones(evento.index, evento.reservacion));
      const data = await lastValueFrom(this.storageService.getReservaciones());
      this.reservaciones = data.sort((a, b) => a.no_reservacion - b.no_reservacion);
      this.updateChart();
      Swal.fire({
        title: 'Registro editado',
        icon: 'success',
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      });
    } catch (err) {
      console.error('Error al editar:', err);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo editar el registro',
        icon: 'error',
        confirmButtonColor: 'gold',
        background: '#1e1e1e',
        color: 'white'
      });
    }
  }

  toggleActive() {
    this.isActive = !this.isActive;
  }
  
  updateChart() {
    this.chartData.forEach(item => item.value = 0);

    this.reservaciones.forEach(reservacion => {
      const habitacion = reservacion.habitacion.toLowerCase();
      const item = this.chartData.find(c => c.name.toLowerCase() === habitacion);
      if (item) {
        item.value++;
      }
    });
    this.chartOptions = {
      ...this.chartOptions,
      series: [{
        ...this.chartOptions.series[0],
        data: [...this.chartData]     // Forzar actualización
      }]
    };
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
