// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
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
    chartDataClients: BarChartDataPoint[] = []; // Datos para el gráfico de clientes
    chartDataIssuers: BarChartDataPoint[] = []; // Datos para el gráfico de proveedores
    loadingData: boolean = true;
    consultaPeriodo: string = 'mensual';
    resultadosConsulta: any = null;
    consultaPeriodoKeys: string[] = [];

    selectedYear: string = '';
    availableYears: string[] = [];

    constructor(private firebaseService: FirebaseService) { }

    ngOnInit(): void {
        this.loadFacturas().then(() => { // Aseguramos que loadFacturas() termine antes
            this.realizarConsulta(); // <-- Llamamos a realizarConsulta() aquí, al inicio
        });
    }

    async loadFacturas(): Promise<void> {
        this.loadingData = true;
        this.facturas = await this.firebaseService.getBillsForCurrentUser();
        this.extractAvailableYears();
        this.selectedYear = this.availableYears[0] || new Date().getFullYear().toString();
        this.prepareChartData();
        this.prepareClientChartData(); // Preparar datos para el gráfico de clientes
        this.prepareIssuerChartData(); // Preparar datos para el gráfico de proveedores
        this.loadingData = false;
    }

    extractAvailableYears(): void {
        const years = new Set<string>();
        this.facturas.forEach(factura => {
            const fechaEmisionString = factura.fechaEmision;
            const fechaEmision = this.parseDate(fechaEmisionString);
            if (fechaEmision) {
                years.add(fechaEmision.getFullYear().toString());
            }
        });
        this.availableYears = Array.from(years).sort();
    }


    onYearChange(): void {
        this.prepareChartData();
        this.prepareClientChartData(); // Recalcular datos al cambiar el año
        this.prepareIssuerChartData(); // Recalcular datos al cambiar el año
    }


    prepareChartData(): void {
        const selectedYear = this.selectedYear;
        if (this.facturas && this.facturas.length > 0 && selectedYear) {
            const monthlyTotals: { [month: string]: number } = {};
            this.facturas
                .filter(factura => {
                    const fechaEmisionString = factura.fechaEmision;
                    const fechaEmision = this.parseDate(fechaEmisionString);
                    return fechaEmision && fechaEmision.getFullYear().toString() === selectedYear;
                })
                .forEach(factura => {
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
                    category: month,
                    month: month,
                    total: monthlyTotals[month]
                }))
                .sort((a, b) => {
                    const monthOrder = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
                    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
                });
        } else {
            this.chartData = [];
        }
    }

    prepareClientChartData(): void {
        const selectedYear = this.selectedYear;
        if (this.facturas && this.facturas.length > 0 && selectedYear) {
            const clientTotals: { [client: string]: number } = {};
            this.facturas
                .filter(factura => {
                    const fechaEmisionString = factura.fechaEmision;
                    const fechaEmision = this.parseDate(fechaEmisionString);
                    return fechaEmision && fechaEmision.getFullYear().toString() === selectedYear;
                })
                .forEach(factura => {
                    const clientName = factura.clienteReceptor;
                    clientTotals[clientName] = (clientTotals[clientName] || 0) + factura.total;
                });

            this.chartDataClients = Object.keys(clientTotals)
                .map(client => ({
                    category: client, // Use 'category' instead of 'month'
                    client: client,    // Keep client for tooltip if needed
                    total: clientTotals[client]
                }));
        } else {
            this.chartDataClients = [];
        }
    }

    prepareIssuerChartData(): void {
        const selectedYear = this.selectedYear;
        if (this.facturas && this.facturas.length > 0 && selectedYear) {
            const issuerTotals: { [issuer: string]: number } = {};
            this.facturas
                .filter(factura => {
                    const fechaEmisionString = factura.fechaEmision;
                    const fechaEmision = this.parseDate(fechaEmisionString);
                    return fechaEmision && fechaEmision.getFullYear().toString() === selectedYear;
                })
                .forEach(factura => {
                    const issuerName = factura.empresaEmisor;
                    issuerTotals[issuerName] = (issuerTotals[issuerName] || 0) + factura.total;
                });

            this.chartDataIssuers = Object.keys(issuerTotals)
                .map(issuer => ({
                    category: issuer, // Use 'category' instead of 'month'
                    issuer: issuer,    // Keep issuer for tooltip if needed
                    total: issuerTotals[issuer]
                }));
        } else {
            this.chartDataIssuers = [];
        }
    }


    realizarConsulta(): void {
        if (!this.facturas || this.facturas.length === 0) {
            this.resultadosConsulta = null;
            this.consultaPeriodoKeys = [];
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
            this.consultaPeriodoKeys = Object.keys(this.resultadosConsulta);
        } else {
            this.consultaPeriodoKeys = [];
        }
    }

    parseDate(dateString: string): Date | null {
        if (!dateString) {
            return null;
        }
        const parts = dateString.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);

            const date = new Date(year, month, day);
            if (isNaN(date.getTime())) {
                return null;
            }
            return date;
        } else {
            return null;
        }
    }


    calcularTotalesMensuales(): any {
        const monthlyTotals: { [month: string]: any } = {};

        this.facturas.forEach(factura => {


            const fechaEmisionString = factura.fechaEmision;
            console.log("fechaEmision (string):", fechaEmisionString);

            const fechaEmision = this.parseDate(fechaEmisionString);
            console.log("fechaEmision (Date):", fechaEmision);

            if (!fechaEmision) {
                console.error("Invalid Date detected for:", fechaEmisionString);
                return;
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

            const fechaEmision = this.parseDate(fechaEmisionString);
            console.log("fechaEmision (Date):", fechaEmision);

            if (!fechaEmision) {
                console.error("Invalid Date detected for:", fechaEmisionString);
                return;
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

            const fechaEmision = this.parseDate(fechaEmisionString);
            console.log("fechaEmision (Date):", fechaEmision);

            if (!fechaEmision) {
                console.error("Invalid Date detected for:", fechaEmisionString);
                return;
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