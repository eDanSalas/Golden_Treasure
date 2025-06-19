import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReactiveComponent } from './admin-reactive.component';

describe('AdminReactiveComponent', () => {
  let component: AdminReactiveComponent;
  let fixture: ComponentFixture<AdminReactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReactiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
