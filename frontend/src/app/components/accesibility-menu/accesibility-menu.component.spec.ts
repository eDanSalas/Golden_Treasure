import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesibilityMenuComponent } from './accesibility-menu.component';

describe('AccesibilityMenuComponent', () => {
  let component: AccesibilityMenuComponent;
  let fixture: ComponentFixture<AccesibilityMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccesibilityMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccesibilityMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
