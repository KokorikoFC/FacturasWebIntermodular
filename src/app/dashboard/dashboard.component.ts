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
        this.loadFacturas().then(() => { // Asegura que loadFacturas() termine antes
            this.realizarConsulta();
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
                    category: client,
                    client: client,
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
                    category: issuer,
                    issuer: issuer,
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

            // Calcular el importe del IVA
            const ivaPercentage = this.getIvaPercentage(factura);
            const ivaAmount = (factura.baseImponible || 0) * (ivaPercentage / 100);

            // Calcular el importe del IRPF
            const irpfPercentage = this.getIrpfPercentage(factura);
            const irpfAmount = (factura.baseImponible || 0) * (irpfPercentage / 100);

            if (!quarterlyTotals[quarter]) {
                quarterlyTotals[quarter] = {
                    baseImponible: 0,
                    iva: 0,
                    irpf: 0,
                    total: 0
                };
            }
            quarterlyTotals[quarter].baseImponible += factura.baseImponible || 0;
            quarterlyTotals[quarter].iva += ivaAmount; // Sumar el importe del IVA calculado
            quarterlyTotals[quarter].irpf += irpfAmount; // Sumar el importe del IRPF calculado
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

            // Calcular el importe del IVA
            const ivaPercentage = this.getIvaPercentage(factura);
            const ivaAmount = (factura.baseImponible || 0) * (ivaPercentage / 100);

            // Calcular el importe del IRPF
            const irpfPercentage = this.getIrpfPercentage(factura);
            const irpfAmount = (factura.baseImponible || 0) * (irpfPercentage / 100);

            if (!annualTotals[year]) {
                annualTotals[year] = {
                    baseImponible: 0,
                    iva: 0,
                    irpf: 0,
                    total: 0
                };
            }
            annualTotals[year].baseImponible += factura.baseImponible || 0;
            annualTotals[year].iva += ivaAmount; // Sumar el importe del IVA calculado
            annualTotals[year].irpf += irpfAmount; // Sumar el importe del IRPF calculado
            annualTotals[year].total += factura.total || 0;
        });
        return annualTotals;
    }

    // Función para obtener el porcentaje de IVA directamente de la factura
    getIvaPercentage(factura: any): number {
        return factura.iva || 0;
    }

    // Función para obtener el porcentaje de IRPF directamente de la factura
    getIrpfPercentage(factura: any): number {
        return factura.irpf || 0;
    }
}