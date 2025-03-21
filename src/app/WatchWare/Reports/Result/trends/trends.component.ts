import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryScale, Chart, registerables } from 'chart.js';
import { DataAggregationType } from '../../../Interfaces/ReportSubmitFilter';
import { Company } from '../../../Interfaces/Company';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CompanyService } from '../../../Services/company.service';

@Component({
  selector: 'app-trends',
  imports: [FormsModule, CommonModule, ToastrModule],
  templateUrl: './trends.component.html',
  styleUrl: './trends.component.css',
  providers: [ToastrService]
})
export class TrendsComponent implements OnInit {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  chart: Chart | undefined;
  @Input() companyId: any;
  @Input() data: any;
  @Input() from: any;
  @Input() to: any;
  @Input() aggregationType: any;
  Company!: Company;

  constructor(private companyService: CompanyService, private toastService: ToastrService) { Chart.register(...registerables, CategoryScale); }
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
    this.loadCompanyDetails(this.companyId);
  }
  getAggregationTypeName(value: number): string {
    return DataAggregationType[value] || 'Unknown';
  }
  // onExport() {


  //   if (!this.chartCanvas) {
  //     console.error("Chart canvas not found.");
  //     return;
  //   }

  //   const canvas = this.chartCanvas.nativeElement as HTMLCanvasElement;
  //   const ctx = canvas.getContext('2d');

  //   if (!ctx) {
  //     console.error("Unable to get canvas context.");
  //     return;
  //   }


  //   const tempCanvas = document.createElement('canvas');
  //   tempCanvas.width = canvas.width;
  //   tempCanvas.height = canvas.height;
  //   const tempCtx = tempCanvas.getContext('2d');

  //   if (!tempCtx) {
  //     console.error("Unable to get temp canvas context.");
  //     return;
  //   }


  //   tempCtx.fillStyle = 'white';
  //   tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);


  //   tempCtx.drawImage(canvas, 0, 0);


  //   const image = tempCanvas.toDataURL("image/jpeg", 1.0);


  //   const link = document.createElement('a');
  //   link.href = image;
  //   link.download = 'trend_data.jpeg';
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }
  onExport() {
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

    // Extra space at the top for the header (logo, company name, and details)
    const headerHeight = 130; // Increased height for better spacing

    // Create a temporary canvas with extra header space
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height + headerHeight;

    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) {
      console.error("Unable to get temp canvas context.");
      return;
    }

    // Fill background with white
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Handle company logo
    const logo = new Image();
    if (this.Company?.Logo instanceof Uint8Array) {
      // Convert Uint8Array to Base64
      const base64String = this.arrayBufferToBase64(this.Company.Logo);
      logo.src = `data:image/png;base64,${base64String}`;
    } else {
      logo.src = 'assets/logo/Logo.png'; // Fallback logo
    }

    logo.onload = () => {
      const logoWidth = 80;
      const logoHeight = 80;
      const logoX = 10;
      const logoY = 10;

      // Draw logo
      tempCtx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

      // Add company name
      tempCtx.font = 'bold 14px Arial';
      tempCtx.fillStyle = 'gray';
      tempCtx.fillText(this.Company?.LegalName || 'Company Name', logoX + logoWidth + 15, logoY + 25);

      // Add additional details below the company name
      tempCtx.font = '14px Arial';
      tempCtx.fillStyle = 'gray';

      // Adjusting vertical spacing
      const textX = logoX + logoWidth + 15;
      const textY = logoY + 50; // Below the company name

      tempCtx.fillText(`From: ${this.formatDateTime(this.from) || 'N/A'}`, textX, textY);
      tempCtx.fillText(`To: ${this.formatDateTime(this.to) || 'N/A'}`, textX, textY + 20);
      tempCtx.fillText(`Average: ${this.getAggregationTypeName(this.aggregationType)}`, textX, textY + 40);

      // Draw the chart below the header with some extra spacing
      tempCtx.drawImage(canvas, 0, headerHeight);

      // Convert to JPEG
      const image = tempCanvas.toDataURL("image/jpeg", 1.0);

      // Download the image
      const link = document.createElement('a');
      link.href = image;
      link.download = 'trend_data.jpeg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    logo.onerror = () => {
      console.error("Failed to load the logo image.");
    };
  }
  formatDateTime(date: Date): string {
    return date ? new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // 24-hour format
    }) : '';
  }

  // Helper function: Convert Uint8Array to Base64
  arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  loadCompanyDetails(companyId: number) {
    this.companyService.GetCompanyById(companyId).subscribe({
      next: (company) => {
        this.Company = company;
        this.toastService.success('Company details loaded successfully');
      },
      error: (error) => {
        this.toastService.error('Unable to fetch company details for report exporting.');
        console.log(error);
      }
    })
  }
}
