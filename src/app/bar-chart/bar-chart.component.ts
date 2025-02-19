// bar-chart.component.ts
import { Component, Input, ElementRef, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { CommonModule } from '@angular/common';

// Define la interfaz para los datos del gráfico de barras
export interface BarChartDataPoint {
  month: string;
  total: number;
  [key: string]: any; // Index signature: Allow string indexing
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: '<svg #chart></svg>',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent implements OnChanges {
  @ViewChild('chart', { static: true }) chartRef!: ElementRef;
  @Input() data: BarChartDataPoint[] = []; // Usa la interfaz BarChartDataPoint[]
  @Input() categoryField: string = '';
  @Input() valueField: string = '';

  private svg: any;
  private margin = { top: 20, right: 20, bottom: 30, left: 40 };
  private width = 600 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.createChart();
    }
  }

  createChart(): void {
    if (!this.data || this.data.length === 0) {
      return;
    }

    this.width = 600 - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;

    this.svg = d3.select(this.chartRef.nativeElement)
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    // Limpia el contenido anterior del SVG para evitar que se superpongan gráficos
    this.svg.selectAll('*').remove();

    const g = this.svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    const x = d3.scaleBand()
      .domain(this.data.map(d => d[this.categoryField])) // No type assertion needed now
      .rangeRound([0, this.width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d[this.valueField])]) // No type assertion needed now
      .range([this.height, 0]);

    g.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Value");

    g.selectAll(".bar")
      .data(this.data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d: BarChartDataPoint) => x(d[this.categoryField])) // No type assertion needed now
      .attr("y", (d: BarChartDataPoint) => y(d[this.valueField])) // No type assertion needed now
      .attr("width", x.bandwidth())
      .attr("height", (d: BarChartDataPoint) => this.height - y(d[this.valueField])) // No type assertion needed now
      .attr("fill", "steelblue");
  }
}