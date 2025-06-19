import { TestBed } from '@angular/core/testing';

import { DesarrolladorService } from './desarrollador.service';

describe('DesarrolladorService', () => {
  let service: DesarrolladorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesarrolladorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
