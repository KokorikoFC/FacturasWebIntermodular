import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import * as d3 from 'd3';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-professional-itinerarie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professional-itineraries.component.html',
  styleUrl: './professional-itineraries.component.css'
})
export class ProfessionalItinerariesComponent implements OnInit, OnChanges {
  @Input() itineraryData?: any;
  itineraries: any[] = [];
  selectedItinerary: any = null;
  loadingData: boolean = true;

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    this.loadingData = true;
    this.itineraries = await this.firebaseService.getAllItineraries();

    if (this.itineraries.length > 0) {
      this.selectedItinerary = this.itineraries[0];
      this.drawRadarChart(this.selectedItinerary.technologies);
    }
    this.loadingData = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itineraryData'] && changes['itineraryData'].currentValue) {
      this.drawRadarChart(changes['itineraryData'].currentValue.technologies);
    }
  }

  onItineraryChange(event: any): void {
    const itineraryId = event.target.value;
    this.selectedItinerary = this.itineraries.find(
      (itinerary) => itinerary.id === itineraryId
    );
    this.drawRadarChart(this.selectedItinerary?.technologies || []);
  }

  drawRadarChart(technologies: any[]): void {
    d3.select('#chart').selectAll('*').remove();

    if (!technologies || technologies.length === 0) return;

    console.log("Datos de tecnologías:", technologies); // 👈  AÑADE ESTA LÍNEA

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

    for (let i = 1; i <= levels; i++) {
      chartGroup
        .append('circle')
        .attr('r', scale(100) / levels * i)
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .style('stroke-dasharray', '3 3');
    }

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
        .style('fill', '#333'); // He puesto el color del texto en gris oscuro (#333)
    });

    const radarLine = d3
      .lineRadial()
      .radius((d: any) => scale(d.level))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    chartGroup
      .append('path')
      .datum(technologies)
      .attr('d', radarLine)
      .attr('fill', 'rgba(0, 128, 255, 0.3)')
      .attr('stroke', '#007bff')
      .attr('stroke-width', 2);

    chartGroup.selectAll('.radarCircle')
      .data(technologies)
      .enter().append('circle')
      .attr('class', 'radarCircle')
      .attr('r', 4)
      .attr('cx', (d, i) => scale(d.level) * Math.cos(i * angleSlice - Math.PI / 2))
      .attr('cy', (d, i) => scale(d.level) * Math.sin(i * angleSlice - Math.PI / 2))
      .style('fill', '#007bff')
      .style('fill-opacity', 0.8);
  }
}

