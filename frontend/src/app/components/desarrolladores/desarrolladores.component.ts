import { Component } from '@angular/core';
import { Desarrollador } from '../../desarrollador';
import { DesarrolladorService } from '../../services/desarrollador.service';

@Component({
  selector: 'app-desarrolladores',
  imports: [],
  templateUrl: './desarrolladores.component.html',
  styleUrl: './desarrolladores.component.css'
})
export class DesarrolladoresComponent {
  desarrolladores: Desarrollador[] = [];
  
  constructor(public miservicio: DesarrolladorService) {
    console.log('constructor devs');
  }
  
  ngOnInit(): void {
    console.log("ngOnInit desarrolladores");
    this.desarrolladores = this.miservicio.getDevs();
    console.log(this.desarrolladores);
    window.scrollTo({ top: 0 });
  }
}
