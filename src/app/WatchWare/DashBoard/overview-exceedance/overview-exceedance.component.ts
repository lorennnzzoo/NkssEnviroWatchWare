import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Station } from '../../Interfaces/Station';
import { ReportService } from '../../Services/report.service';
import { DataAggregationType, ReportFilter, ReportType } from '../../Interfaces/ReportSubmitFilter';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';

const exceededCounts: { [key: string]: number } = {};

@Component({
  selector: 'app-overview-exceedance',
  imports: [CommonModule],
  templateUrl: './overview-exceedance.component.html',
  styleUrl: './overview-exceedance.component.css'
})
export class OverviewExceedanceComponent implements OnInit, AfterViewInit {

  @Input() Station!: Station;
  @ViewChild('pieChartCanvas') pieChartCanvas!: ElementRef;
  reportData: any = null;
  Loading: boolean = false;
  DataExists: boolean = false;
  chart!: Chart;

  constructor(private reportService: ReportService) { }
  isAllExceedanceZero(): boolean {
    return Object.values(exceededCounts).every(count => count === 0);
  }

  ngOnInit(): void {
    this.loadOverviewData(this.Station);
  }

  ngAfterViewInit(): void {
    if (this.DataExists) {
      setTimeout(() => this.renderChart(), 100);
    }
  }

  loadOverviewData(station: Station) {
    this.Loading = true;
    const reportFilter: ReportFilter = {
      companyId: station.CompanyId,
      stationsId: [station.Id],
      channelsId: [],
      dataAggregationType: DataAggregationType.Raw,
      // from: new Date('2020-01-01T00:00:00'),
      // to: new Date('2020-01-01T11:59:59'),
      from: new Date(new Date().setHours(new Date().getHours() - 12)),
      to: new Date(),
      reportType: ReportType.Exceedance
    };

    this.reportService.GetDataReport(reportFilter).subscribe({
      next: (report) => {
        this.DataExists = report.length > 0;
        this.Loading = false;
        this.reportData = report;
        setTimeout(() => this.renderChart(), 100);
      },
      error: (error) => {
        this.Loading = false;
        console.error("Error loading chart data", error);
      }
    });
  }

  renderChart() {
    if (!this.pieChartCanvas || !this.pieChartCanvas.nativeElement) {
      console.error('Pie chart canvas is not available');
      return;
    }

    const exceededCounts = this.calculateExceededCounts();
    console.log(exceededCounts);

    const chartData = {
      labels: Object.keys(exceededCounts),
      datasets: [{
        label: 'Exceeded Count',
        data: Object.values(exceededCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9C27B0']
      }]
    };

    const chartConfig: ChartConfiguration = {
      type: 'pie' as ChartType,
      data: chartData,
      options: {
        responsive: true
      }
    };

    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.pieChartCanvas.nativeElement, chartConfig);
  }

  calculateExceededCounts() {


    this.reportData.forEach((entry: any) => {
      Object.keys(entry).forEach((key) => {
        if (key.includes('_Exceeded')) {
          const paramName = key.replace('_Exceeded', '');

          // Ensure parameter exists in the object, even if it's 0
          if (!(paramName in exceededCounts)) {
            exceededCounts[paramName] = 0;
          }

          if (entry[key]) {
            exceededCounts[paramName] += 1;
          }
        }
      });
    });

    return exceededCounts;
  }
}
