import { Component } from '@angular/core';
import { Comentario } from '../../comentario';
import { ComentarioService } from '../../services/comentario.service';

@Component({
  selector: 'app-comentarios',
  imports: [],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent {
  comentarios: Comentario[] = [];

  constructor(private miservicio: ComentarioService) { 
    console.log("constructor de comentarios");
  }

  formatFecha(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    const opciones: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    return fecha.toLocaleDateString("es-ES", opciones);
  }


  ngOnInit(): void {
    console.log("ngOnInit comentarios");
    this.comentarios = this.miservicio.getComments();
    console.log(this.comentarios);
    window.scrollTo({ top: 0 });
  }
}
