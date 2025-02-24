// bar-chart.component.ts
import { Component, Input, ElementRef, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { CommonModule } from '@angular/common';

// Define la interfaz para los datos del gráfico de barras
export interface BarChartDataPoint {
  category: string; // Changed from month to category
  total: number;
  client?: string;
  issuer?: string;
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
  @Input() data: BarChartDataPoint[] = [];
  @Input() categoryField: string = '';
  @Input() valueField: string = '';
  @Input() chartTitle: string = '';

  private svg: any;
  private margin = { top: 60, right: 20, bottom: 50, left: 70 };
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

    this.svg.selectAll('*').remove();

    const g = this.svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    g.append("text")
      .attr("x", this.width / 2)
      .attr("y", -this.margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(this.chartTitle);


    const x = d3.scaleBand()
      .domain(this.data.map(d => d[this.categoryField]))
      .rangeRound([0, this.width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d[this.valueField])])
      .range([this.height, 0]);

    g.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-4.5em")
      .attr("text-anchor", "end")
      .attr("font-weight", "bold")
      .text("Total (€)");

    g.selectAll(".bar")
      .data(this.data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d: BarChartDataPoint) => x(d[this.categoryField]))
      .attr("y", (d: BarChartDataPoint) => y(d[this.valueField]))
      .attr("width", x.bandwidth())
      .attr("height", (d: BarChartDataPoint) => this.height - y(d[this.valueField]))
      .attr("fill", "steelblue");
  }
}