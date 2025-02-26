import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import * as d3 from 'd3';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-professional-itinerarie',
  standalone: true,
  imports: [CommonModule, FormsModule,NavbarComponent],
  templateUrl: './professional-itineraries.component.html',
  styleUrls: ['./professional-itineraries.component.css'],
})
export class ProfessionalItinerariesComponent implements OnInit, OnChanges {
  @Input() itineraryData?: any;
  itineraries: any[] = [];
  selectedItinerary: any = null;
  loadingData: boolean = true;
  userTechnologies: any[] = []; // Para almacenar las tecnologías del usuario

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    this.loadingData = true;

    // Obtener todos los itinerarios
    this.itineraries = await this.firebaseService.getAllItineraries();

    // Si hay itinerarios, seleccionar el primero por defecto
    if (this.itineraries.length > 0) {
      this.selectedItinerary = this.itineraries[0];
      this.drawRadarChart(this.selectedItinerary.technologies);
    }

    // Obtener el ID del usuario autenticado
    const user = this.firebaseService.getCurrentUser();
    if (user) {
      // Si hay un usuario autenticado, obtener sus tecnologías
      this.userTechnologies = await this.firebaseService.getUserTechnologies(user.uid);
      console.log('Tecnologías del usuario:', this.userTechnologies);
    } else {
      console.error('No user logged in');
    }

    this.loadingData = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itineraryData'] && changes['itineraryData'].currentValue) {
      this.drawRadarChart(changes['itineraryData'].currentValue.technologies);
    }
  }

  // Método para manejar el cambio en el itinerario seleccionado
  onItineraryChange(event: any): void {
    const itineraryId = event.target.value;
    this.selectedItinerary = this.itineraries.find(
      (itinerary) => itinerary.id === itineraryId
    );
    this.drawRadarChart(this.selectedItinerary?.technologies || []);
  }

  // Dibuja el gráfico de radar
  drawRadarChart(technologies: any[]): void {
    d3.select('#chart').selectAll('*').remove();
    if (!technologies || technologies.length === 0) return;
  
    const width = 600;
    const height = 600;
    const radius = 250;
  
    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  
    const chartGroup = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
  
    const levels = 5;
    const angleSlice = (2 * Math.PI) / technologies.length;
    const scale = d3.scaleLinear().domain([0, 100]).range([0, radius]);
  
    // Dibujar los círculos concéntricos
    for (let i = 1; i <= levels; i++) {
      chartGroup
        .append('circle')
        .attr('r', (scale(100) / levels) * i)
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .style('stroke-dasharray', '3 3');
    }
  
    // Dibujar líneas radiales y etiquetas de tecnología
    technologies.forEach((tech, i) => {
      const angle = i * angleSlice;
      const labelX = scale(100 + 10) * Math.cos(angle - Math.PI / 2);
      const labelY = scale(100 + 10) * Math.sin(angle - Math.PI / 2);
  
      chartGroup
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', scale(100) * Math.cos(angle - Math.PI / 2))
        .attr('y2', scale(100) * Math.sin(angle - Math.PI / 2))
        .attr('stroke', '#ccc');
  
      chartGroup
        .append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .text(tech.id)
        .attr('font-size', '12px')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('fill', '#333');
    });
  
    // Obtener los niveles del usuario
    const userLevels = technologies.map((tech) => {
      const userTech = this.userTechnologies.find((ut) => ut.id === tech.id);
      return {
        id: tech.id,
        level: userTech ? userTech.level : 0, // Si no tiene la tecnología, nivel 0
      };
    });
  
    // Función para crear líneas del radar
    const radarLine = d3
      .lineRadial()
      .radius((d: any) => scale(d.level))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);
  
    // Dibujar área del itinerario (objetivo)
    chartGroup
      .append('path')
      .datum(technologies)
      .attr('d', radarLine)
      .attr('fill', 'rgb(249, 227, 183,0.3)')
      .attr('stroke', '#f9e3b7')
      .attr('stroke-width', 2);
  
    // Dibujar área del usuario (real)
  chartGroup
  .append('path')
  .datum(userLevels as any[]) 
  .attr('d', radarLine)
  .attr('fill', 'rgb(240, 161, 157,0.3)')
  .attr('stroke', '#f0a19d')
  .attr('stroke-width', 2);
  
  
    // Dibujar puntos del itinerario
    chartGroup
      .selectAll('.radarCircle')
      .data(technologies)
      .enter()
      .append('circle')
      .attr('class', 'radarCircle')
      .attr('r', 4)
      .attr('cx', (d, i) => scale(d.level) * Math.cos(i * angleSlice - Math.PI / 2))
      .attr('cy', (d, i) => scale(d.level) * Math.sin(i * angleSlice - Math.PI / 2))
      .style('fill', '#f9e3b7')
      .style('fill-opacity', 0.9);
  
    // Dibujar puntos del usuario
    chartGroup
      .selectAll('.userCircle')
      .data(userLevels)
      .enter()
      .append('circle')
      .attr('class', 'userCircle')
      .attr('r', 4)
      .attr('cx', (d, i) => scale(d.level) * Math.cos(i * angleSlice - Math.PI / 2))
      .attr('cy', (d, i) => scale(d.level) * Math.sin(i * angleSlice - Math.PI / 2))
      .style('fill', '#f0a19d')
      .style('fill-opacity', 0.9);
  }
  

  // Método para obtener las tecnologías del usuario y mostrarlas en el formulario
  getUserTechnologiesToDisplay() {
    return this.userTechnologies;
  }

  // Método para guardar las tecnologías ajustadas por el usuario
  async saveUserTechnologies() {
    const user = this.firebaseService.getCurrentUser();
    if (user) {
      // Actualizar las tecnologías del usuario en la base de datos
      await this.firebaseService.updateUserTechnologies(user.uid, this.userTechnologies);
      console.log('Tecnologías actualizadas:', this.userTechnologies);
      alert('Tecnologías guardadas correctamente.');
    } else {
      console.error('No user logged in');
    }
  }
}
