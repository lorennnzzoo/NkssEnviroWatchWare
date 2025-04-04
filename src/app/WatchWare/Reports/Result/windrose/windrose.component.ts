import { Component, Input, OnInit } from '@angular/core';
import { Company } from '../../../Interfaces/Company';
import { CompanyService } from '../../../Services/company.service';
import { ToastrService } from 'ngx-toastr';
import { DataAggregationType } from '../../../Interfaces/ReportSubmitFilter';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { CommonModule } from '@angular/common';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-windrose',
  imports: [PlotlyModule, CommonModule],
  templateUrl: './windrose.component.html',
  styleUrl: './windrose.component.css'
})
export class WindroseComponent implements OnInit {
  @Input() companyId: any;
  @Input() data: any;
  @Input() from: any;
  @Input() to: any;
  @Input() aggregationType: any;
  Company!: Company;

  constructor(private companyService: CompanyService, private toastService: ToastrService) { }

  ngOnInit(): void {
    if (!this.data || this.data.length == 0) {
      console.warn("No data available to generate chart");
      return;
    }
    this.generateWindRose();
    this.loadCompanyDetails(this.companyId);
  }

  getAggregationTypeName(value: number): string {
    return DataAggregationType[value] || 'Unknown';
  }

  loadCompanyDetails(companyId: number) {
    this.companyService.GetCompanyById(companyId).subscribe({
      next: (company) => {
        this.Company = company;
      },
      error: (error) => {
        this.toastService.error('Unable to fetch company details for report exporting.');
        console.log(error);
      }
    })
  }


  plotData: any[] = [];
  layout: any = {
    title: 'Wind Rose - 24 Hours',
    polar: {
      radialaxis: { ticksuffix: '%', angle: 45 },
      angularaxis: { direction: 'clockwise' },
    },
    showlegend: true,
    margin: { t: 30, b: 30, l: 30, r: 30 }
  };
  generateWindRose(): void {
    if (!this.data || this.data.length === 0) return;

    const directions = [
      'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
    ];
    const dirStep = 360 / directions.length;
    const bins: { [key: string]: number[] } = {};
    directions.forEach(dir => bins[dir] = []);

    for (const entry of this.data) {
      const speed = parseFloat(entry['Weather-Wind Speed-km/h']);
      const dirDeg = parseFloat(entry['Weather-Wind Direction-DegC']);
      if (isNaN(speed) || isNaN(dirDeg)) continue;
      const dirIdx = Math.floor(dirDeg / dirStep) % directions.length;
      bins[directions[dirIdx]].push(speed);
    }

    const speedBins = [0, 5, 10, 15, 20, 25];
    const traces = [];

    for (let i = 0; i < speedBins.length - 1; i++) {
      const label = `${speedBins[i]}-${speedBins[i + 1]} km/h`;
      const r: number[] = [];
      const theta: string[] = [];

      for (const dir of directions) {
        const count = bins[dir].filter(s => s >= speedBins[i] && s < speedBins[i + 1]).length;
        const percent = (count / this.data.length) * 100;
        r.push(percent);
        theta.push(dir);
      }

      traces.push({
        r,
        theta,
        type: 'barpolar',
        name: label,
      });
    }

    this.plotData = traces;
  }
}
