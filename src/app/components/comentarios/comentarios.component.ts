import { Component } from '@angular/core';
import { Comentario } from '../../comentario';
import { ComentarioService } from '../../services/comentario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comentarios',
  imports: [CommonModule],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent {
  comentarios: Comentario[] = [];

  constructor(private comentarioService: ComentarioService) {}

  ngOnInit(): void {
    this.comentarios = this.comentarioService.getComments();
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
}
