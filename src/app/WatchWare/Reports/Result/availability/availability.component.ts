import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DataAggregationType } from '../../../Interfaces/ReportSubmitFilter';
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import * as XLSX from 'xlsx';
import { CompanyService } from '../../../Services/company.service';
import { Company } from '../../../Interfaces/Company';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AvailabilityData {
  [key: string]: any;
}

@Component({
  selector: 'app-availability',
  imports: [CommonModule, TableModule, MenuModule, ButtonModule, ToastrModule],
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.css',
  providers: [ToastrService]
})
export class AvailabilityComponent implements OnInit {

  @Input() companyId: any;
  @Input() data: any;
  @Input() from: any;
  @Input() to: any;
  @Input() aggregationType: any;
  Company!: Company;
  columns: { field: string; header: string }[] = [];

  constructor(private companyService: CompanyService, private toastService: ToastrService) { }

  ngOnInit() {
    if (this.data.length > 0) {
      this.columns = Object.keys(this.data[0]).map((key) => ({
        field: key,
        header: key.charAt(0).toUpperCase() + key.slice(1)
      }));
    }
    this.loadCompanyDetails(this.companyId);
  }
  getAggregationTypeName(value: number): string {
    return DataAggregationType[value] || 'Unknown';
  }
  formatDateTime(date: Date): string {
    return date ? new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }) : '';
  }

  onExportPdf() {
    if (!this.data || this.data.length === 0) {
      console.warn("No data available for export.");
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4'); // Portrait mode, A4 size
    const marginLeft = 10;
    let yPosition = 10; // Initial Y position for content

    // Load Company Logo
    const logo = new Image();
    if (this.Company?.Logo instanceof Uint8Array) {
      const base64String = this.arrayBufferToBase64(this.Company.Logo);
      logo.src = `data:image/png;base64,${base64String}`;
    } else {
      logo.src = 'assets/logo/Logo.png'; // Fallback logo
    }

    logo.onload = () => {
      // Draw logo
      doc.addImage(logo, 'PNG', marginLeft, yPosition, 30, 30);

      // Move yPosition down for text content
      yPosition += 35;

      // Set font for header details
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(this.Company?.LegalName || 'Company Name', marginLeft + 40, 20);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      // Additional details below company name
      doc.text(`From: ${this.formatDateTime(this.from)}`, marginLeft + 40, 30);
      doc.text(`To: ${this.formatDateTime(this.to)}`, marginLeft + 40, 35);
      doc.text(`Average: ${this.getAggregationTypeName(this.aggregationType)}`, marginLeft + 40, 40);

      // Move yPosition down for table
      yPosition += 10;

      // Prepare table headers and data
      const headers = [this.columns.map(col => col.header)];
      const tableData = this.data.map((row: any) =>
        this.columns.map(col => row[col.field] + '%')
      );

      // Register and use autoTable
      autoTable(doc, {
        startY: yPosition,
        head: headers,
        body: tableData,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3,
          halign: 'center',
          valign: 'middle'
        },
        headStyles: {
          fillColor: '#8EC04A', // Green header background
          textColor: '#FFFFFF', // White text
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: '#F3F3F3' // Light gray for alternating rows
        },
        margin: { top: yPosition }
      });

      // Save the PDF
      doc.save('availability_report.pdf');
    };

    logo.onerror = () => {
      console.error("Failed to load the logo image.");
    };
  }

  onExportExcel() {

    if (!this.data || this.data.length === 0) {
      return;
    }

    const extraRows = [
      ['Company', this.Company.LegalName],
      ['From:', this.formatDateTime(this.from)],
      ['To:', this.formatDateTime(this.to)],
      []
    ];


    const tableData = this.data.map((row: AvailabilityData) => {
      return this.columns.map(col => row[col.field] + '%');
    });


    const columnHeaders = this.columns.map(col => col.header);


    const finalData = [...extraRows, columnHeaders, ...tableData];


    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(finalData);


    const workbook: XLSX.WorkBook = {
      Sheets: { 'Availability Report': worksheet },
      SheetNames: ['Availability Report']
    };


    XLSX.writeFile(workbook, 'availability_report.xlsx');
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
  arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}
