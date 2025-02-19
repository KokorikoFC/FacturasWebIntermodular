import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { BarChartComponent, BarChartDataPoint } from '../bar-chart/bar-chart.component'; // Importa BarChartDataPoint interface

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, BarChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  facturas: any[] = [];
  chartData: BarChartDataPoint[] = []; // Usa la interfaz BarChartDataPoint[]
  loadingData: boolean = true; // Para indicar que se están cargando los datos

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.loadFacturas();
  }

  async loadFacturas(): Promise<void> {
    this.loadingData = true; // Indica que la carga de datos ha comenzado
    // Usa getBillsForCurrentUser() en lugar de getFacturas()
    this.facturas = await this.firebaseService.getBillsForCurrentUser();
    this.prepareChartData();
    this.loadingData = false; // Indica que la carga de datos ha terminado
  }

  prepareChartData(): void {
    if (this.facturas && this.facturas.length > 0) {
      const monthlyTotals: { [month: string]: number } = {};
      this.facturas.forEach(factura => {
        const month = new Date(factura.fechaEmision).toLocaleString('default', { month: 'short' });
        monthlyTotals[month] = (monthlyTotals[month] || 0) + factura.total;
      });

      this.chartData = Object.keys(monthlyTotals).map(month => ({
        month: month,
        total: monthlyTotals[month]
      }));
    } else {
      this.chartData = []; // Asegura que chartData esté vacío si no hay facturas
    }
  }
}