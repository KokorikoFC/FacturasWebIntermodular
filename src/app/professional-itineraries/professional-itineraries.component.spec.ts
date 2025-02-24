import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalItinerariesComponent } from './professional-itineraries.component';

describe('ProfessionalItinerariesComponent', () => {
  let component: ProfessionalItinerariesComponent;
  let fixture: ComponentFixture<ProfessionalItinerariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalItinerariesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalItinerariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
