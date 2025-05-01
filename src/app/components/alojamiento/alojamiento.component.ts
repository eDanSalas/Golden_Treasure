import { Component } from '@angular/core';
import { HabitacionService } from '../../services/habitacion.service';
import { Habitacion } from '../../habitacion';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alojamiento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alojamiento.component.html',
  styleUrl: './alojamiento.component.css'
})
export class AlojamientoComponent {
  habitaciones: Habitacion[] = [];

  constructor(public habitacionService: HabitacionService) {}

  ngOnInit(): void {
    this.recuperarHabitaciones();
  }

  recuperarHabitaciones(): void {
    this.habitacionService.retornar().subscribe({
      next: this.successRequest.bind(this),error: (err) => console.log(err)
    });
  }

  successRequest(data: any): void {
    console.log(data);
    this.habitaciones = data.habitaciones;
  }
}
