import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @Output() buscar = new EventEmitter<string>();

  onFilter(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.buscar.emit(searchTerm.toLowerCase());
  }

}
