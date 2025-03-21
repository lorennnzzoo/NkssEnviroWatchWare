import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DataAggregationType } from '../../../Interfaces/ReportSubmitFilter';
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import * as XLSX from 'xlsx';

interface AvailabilityData {
  [key: string]: any;
}

@Component({
  selector: 'app-availability',
  imports: [CommonModule, TableModule, MenuModule, ButtonModule],
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.css'
})
export class AvailabilityComponent implements OnInit {

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
    throw new Error('Method not implemented.');
  }
  onExportExcel() {

    if (!this.data || this.data.length === 0) {
      return;
    }

    const extraRows = [
      ['Company', 'NK Square Solutions'],
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
  @Input() data: any;
  @Input() from: any;
  @Input() to: any;
  @Input() aggregationType: any;
  columns: { field: string; header: string }[] = [];

  ngOnInit() {
    if (this.data.length > 0) {
      this.columns = Object.keys(this.data[0]).map((key) => ({
        field: key,
        header: key.charAt(0).toUpperCase() + key.slice(1)
      }));
    }
  }
  getAggregationTypeName(value: number): string {
    return DataAggregationType[value] || 'Unknown';
  }
}
