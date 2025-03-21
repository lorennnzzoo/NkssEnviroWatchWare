import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryScale, Chart, registerables } from 'chart.js';
import { DataAggregationType } from '../../../Interfaces/ReportSubmitFilter';

@Component({
  selector: 'app-trends',
  imports: [FormsModule, CommonModule],
  templateUrl: './trends.component.html',
  styleUrl: './trends.component.css'
})
export class TrendsComponent implements OnInit {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  chart: Chart | undefined;
  @Input() data: any;
  @Input() from: any;
  @Input() to: any;
  @Input() aggregationType: any;

  constructor() { Chart.register(...registerables, CategoryScale); }
  ngOnInit(): void {
    if (!this.data || this.data.length === 0) {
      console.warn("No data available for chart.");
      return;
    }

    if (this.chart) {
      this.chart.destroy(); // Destroy existing chart
    }

    // Extract labels (X-axis) from log timestamps
    const labels = this.data.map((data: any) => new Date(data.LogTime).toLocaleTimeString());

    // Dynamically extract pollutant keys (ignoring 'LogTime')
    const pollutantKeys = Object.keys(this.data[0]).filter(key => key !== 'LogTime');

    // Generate a unique color for each pollutant
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#E91E63', '#00C853'];

    // Create datasets dynamically
    const datasets = pollutantKeys.map((pollutant, index) => ({
      label: pollutant, // Removing "EQMS-" prefix for cleaner labels
      data: this.data.map((data: any) => data[pollutant]),
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
  getAggregationTypeName(value: number): string {
    return DataAggregationType[value] || 'Unknown';
  }
  onExport() {
    // if (!this.chartCanvas) {
    //   console.error("Chart canvas not found.");
    //   return;
    // }

    // const canvas = this.chartCanvas.nativeElement as HTMLCanvasElement;
    // const image = canvas.toDataURL("image/jpeg", 1.0); // Convert to JPEG format


    // const link = document.createElement('a');
    // link.href = image;
    // link.download = 'trend_data.jpeg'; // Set filename
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);


    if (!this.chartCanvas) {
      console.error("Chart canvas not found.");
      return;
    }

    const canvas = this.chartCanvas.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error("Unable to get canvas context.");
      return;
    }


    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    if (!tempCtx) {
      console.error("Unable to get temp canvas context.");
      return;
    }


    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);


    tempCtx.drawImage(canvas, 0, 0);


    const image = tempCanvas.toDataURL("image/jpeg", 1.0);


    const link = document.createElement('a');
    link.href = image;
    link.download = 'trend_data.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
