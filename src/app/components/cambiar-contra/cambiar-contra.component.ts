import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambiar-contra',
  imports: [CommonModule, FormsModule],
  templateUrl: './cambiar-contra.component.html',
  styleUrl: './cambiar-contra.component.css'
})
export class CambiarContraComponent {
  nuevaContra!: string;
  id!: number;
  nombre!: string;
  contra!: string;

constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.queryParamMap.get('id');
    this.id = idParam !== null ? Number(idParam) : 0;
    if (this.id) {
      this.obtenerCliente();
    }
  }

  async obtenerCliente() {
    try {
      const response = await fetch(`https://goldentreasurebackend-production.up.railway.app/api/client/${this.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Error al obtener los datos del cliente');

      const data = await response.json();
      this.nombre = data.nombre;
      this.contra = data.contra;
      console.log("Datos cargados: ", this.nombre + "->", this.contra);
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  }

  cambiar() {
    if (!this.nuevaContra) {
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Indica tu nueva contraseña ${this.nombre}`,
          confirmButtonColor: '#d33'
        });
      return;
    }
    console.log("-----------------------------------");
    console.log(this.id);
    console.log(this.nombre);
    console.log(this.contra);
    console.log(this.nuevaContra);
    console.log("------------------------------------");

    fetch('https://goldentreasurebackend-production.up.railway.app/api/client/changepass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: this.id,
        nombre: this.nombre,
        contra: this.contra,
        nuevaContra: this.nuevaContra
      }),
    })
    .then(async response => {
      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: data.message,
          confirmButtonColor: '#3085d6'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message,
          confirmButtonColor: '#d33'
        });
      }
    })
    .catch(error => {
      console.error('Error en la petición:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo conectar con el servidor',
        confirmButtonColor: '#d33'
      });
    });
  }
}
