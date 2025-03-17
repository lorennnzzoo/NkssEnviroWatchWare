import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../../Services/report.service';
import { Station } from '../../Interfaces/Station';
import { DataAggregationType, ReportFilter, ReportType } from '../../Interfaces/ReportSubmitFilter';
import { CategoryScale, Chart, ChartConfiguration, registerables } from 'chart.js';
@Component({
  selector: 'app-overview-graph',
  imports: [],
  templateUrl: './overview-graph.component.html',
  styleUrl: './overview-graph.component.css'
})
export class OverviewGraphComponent implements OnInit {
  @Input() Station!: Station;
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  chart: Chart | undefined;
  constructor(private reportService: ReportService) { Chart.register(...registerables, CategoryScale); }
  ngOnInit(): void {
    this.loadOverviewData(this.Station);
  }

  loadOverviewData(station: Station) {
    const reportFilter: ReportFilter = {
      companyId: station.CompanyId,
      stationsId: [station.Id],
      channelsId: [],
      dataAggregationType: DataAggregationType.OneHour,
      // from: new Date(new Date().setHours(new Date().getHours() - 1700)), // 24 hours ago
      // to: new Date(),
      from: new Date('2020-01-01T00:00:00'), // From: 2020-01-01 00:00:00
      to: new Date('2020-01-01T23:59:59'),  // To: 2020-01-01 23:59:59

      reportType: ReportType.Trends
    };

    this.reportService.GetDataReport(reportFilter).subscribe({
      next: (report) => {
        console.log(report);
        this.renderChart(report);
      },
      error: (error) => {
        console.error("Error loading chart data", error);
      }
    });
  }

  renderChart(reportData: any) {
    if (!reportData || reportData.length === 0) {
      console.warn("No data available for chart.");
      return;
    }

    if (this.chart) {
      this.chart.destroy(); // Destroy existing chart
    }

    // Extract labels (X-axis) from log timestamps
    const labels = reportData.map((data: any) => new Date(data.LogTime).toLocaleTimeString());

    // Dynamically extract pollutant keys (ignoring 'LogTime')
    const pollutantKeys = Object.keys(reportData[0]).filter(key => key !== 'LogTime');

    // Generate a unique color for each pollutant
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#E91E63', '#00C853'];

    // Create datasets dynamically
    const datasets = pollutantKeys.map((pollutant, index) => ({
      label: pollutant.replace(`${this.Station.Name}-`, ''), // Removing "EQMS-" prefix for cleaner labels
      data: reportData.map((data: any) => data[pollutant]),
      borderColor: colors[index % colors.length], // Cycle through colors
      backgroundColor: colors[index % colors.length] + '33', // Transparent fill
      borderWidth: 2,
      fill: true
    }));

    // Create new chart
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { type: 'category', display: true }, // Use 'category' type for labels
          y: { display: true }
        }
      }
    });
  }
}
