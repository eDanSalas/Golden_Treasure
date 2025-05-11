import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  id!: number;
  
  admin: {[key: number]: string} = {
    1: "Ángel Daniel Lopez Rodriguez",
    2: "Eric Daniel Salas Martínez",
    3: "Diego Adriel Segura Ramírez"
  }

  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

}
