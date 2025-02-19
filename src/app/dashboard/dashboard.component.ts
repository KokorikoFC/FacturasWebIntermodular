import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { BarChartComponent, BarChartDataPoint } from '../bar-chart/bar-chart.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [NavbarComponent, FormsModule, CommonModule, BarChartComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    facturas: any[] = [];
    chartData: BarChartDataPoint[] = [];
    loadingData: boolean = true;
    consultaPeriodo: string = 'mensual'; // Periodo de consulta inicial
    resultadosConsulta: any = null; // Para almacenar los resultados de la consulta
    consultaPeriodoKeys: string[] = []; // Array para almacenar las claves de resultadosConsulta

    constructor(private firebaseService: FirebaseService) { }

    ngOnInit(): void {
        this.loadFacturas();
    }

    async loadFacturas(): Promise<void> {
        this.loadingData = true;
        this.facturas = await this.firebaseService.getBillsForCurrentUser();
        this.prepareChartData(); // Mantiene la preparación de datos para el gráfico
        this.realizarConsulta(); // Ejecuta la consulta inicial al cargar los datos
        this.loadingData = false;
    }

    prepareChartData(): void {
      if (this.facturas && this.facturas.length > 0) {
          const monthlyTotals: { [month: string]: number } = {};
          this.facturas.forEach(factura => {
              const fechaEmisionString = factura.fechaEmision;
              const fechaEmision = this.parseDate(fechaEmisionString);
  
              if (!fechaEmision) {
                  console.error("Invalid Date detected for chart:", fechaEmisionString);
                  return;
              }
  
              const month = fechaEmision.toLocaleString('default', { month: 'short' });
              monthlyTotals[month] = (monthlyTotals[month] || 0) + factura.total;
          });
  
          this.chartData = Object.keys(monthlyTotals)
              .map(month => ({
                  month: month,
                  total: monthlyTotals[month]
              }))
              .sort((a, b) => { // Add sort here
                  const monthOrder = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
                  return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
              });
      } else {
          this.chartData = [];
      }
  }

    realizarConsulta(): void {
        if (!this.facturas || this.facturas.length === 0) {
            this.resultadosConsulta = null;
            this.consultaPeriodoKeys = []; // Ensure keys are also reset
            return;
        }

        switch (this.consultaPeriodo) {
            case 'mensual':
                this.resultadosConsulta = this.calcularTotalesMensuales();
                break;
            case 'trimestral':
                this.resultadosConsulta = this.calcularTotalesTrimestrales();
                break;
            case 'anual':
                this.resultadosConsulta = this.calcularTotalesAnuales();
                break;
            default:
                this.resultadosConsulta = null;
                break;
        }
        if (this.resultadosConsulta) {
            this.consultaPeriodoKeys = Object.keys(this.resultadosConsulta); // Get keys here
        } else {
            this.consultaPeriodoKeys = []; // Ensure keys are reset if resultadosConsulta is null
        }
    }

    parseDate(dateString: string): Date | null {
        if (!dateString) {
            return null; // Handle null or empty date strings
        }
        const parts = dateString.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript Dates
            const year = parseInt(parts[2], 10);

            const date = new Date(year, month, day);
            if (isNaN(date.getTime())) {
                return null; // Date is still invalid after parsing
            }
            return date;
        } else {
            return null; // Invalid format
        }
    }


    calcularTotalesMensuales(): any {
        const monthlyTotals: { [month: string]: any } = {};

        this.facturas.forEach(factura => {
            const fechaEmisionString = factura.fechaEmision;
            console.log("fechaEmision (string):", fechaEmisionString);

            const fechaEmision = this.parseDate(fechaEmisionString); // Use parseDate function
            console.log("fechaEmision (Date):", fechaEmision);

            if (!fechaEmision) { // Check if parseDate returned null (invalid date)
                console.error("Invalid Date detected for:", fechaEmisionString);
                return; // Skip this factura if date is invalid
            }

            const monthYear = fechaEmision.toLocaleString('default', { month: 'short', year: 'numeric' });

            if (!monthlyTotals[monthYear]) {
                monthlyTotals[monthYear] = {
                    baseImponible: 0,
                    iva: 0,
                    irpf: 0,
                    total: 0
                };
            }
            monthlyTotals[monthYear].baseImponible += factura.baseImponible || 0;
            monthlyTotals[monthYear].iva += factura.iva || 0;
            monthlyTotals[monthYear].irpf += factura.irpf || 0;
            monthlyTotals[monthYear].total += factura.total || 0;
        });
        return monthlyTotals;
    }

    calcularTotalesTrimestrales(): any {
        const quarterlyTotals: { [quarter: string]: any } = {};

        this.facturas.forEach(factura => {
            const fechaEmisionString = factura.fechaEmision;
            console.log("fechaEmision (string):", fechaEmisionString);

            const fechaEmision = this.parseDate(fechaEmisionString); // Use parseDate function
            console.log("fechaEmision (Date):", fechaEmision);

            if (!fechaEmision) { // Check if parseDate returned null (invalid date)
                console.error("Invalid Date detected for:", fechaEmisionString);
                return; // Skip this factura if date is invalid
            }

            const year = fechaEmision.getFullYear();
            const quarterNumber = Math.floor((fechaEmision.getMonth() / 3));
            const quarter = `Q${quarterNumber + 1} ${year}`;

            if (!quarterlyTotals[quarter]) {
                quarterlyTotals[quarter] = {
                    baseImponible: 0,
                    iva: 0,
                    irpf: 0,
                    total: 0
                };
            }
            quarterlyTotals[quarter].baseImponible += factura.baseImponible || 0;
            quarterlyTotals[quarter].iva += factura.iva || 0;
            quarterlyTotals[quarter].irpf += factura.irpf || 0;
            quarterlyTotals[quarter].total += factura.total || 0;
        });
        return quarterlyTotals;
    }


    calcularTotalesAnuales(): any {
        const annualTotals: { [year: string]: any } = {};

        this.facturas.forEach(factura => {
            const fechaEmisionString = factura.fechaEmision;
            console.log("fechaEmision (string):", fechaEmisionString);

            const fechaEmision = this.parseDate(fechaEmisionString); // Use parseDate function
            console.log("fechaEmision (Date):", fechaEmision);

            if (!fechaEmision) { // Check if parseDate returned null (invalid date)
                console.error("Invalid Date detected for:", fechaEmisionString);
                return; // Skip this factura if date is invalid
            }

            const year = fechaEmision.getFullYear().toString();

            if (!annualTotals[year]) {
                annualTotals[year] = {
                    baseImponible: 0,
                    iva: 0,
                    irpf: 0,
                    total: 0
                };
            }
            annualTotals[year].baseImponible += factura.baseImponible || 0;
            annualTotals[year].iva += factura.iva || 0;
            annualTotals[year].irpf += factura.irpf || 0;
            annualTotals[year].total += factura.total || 0;
        });
        return annualTotals;
    }
}