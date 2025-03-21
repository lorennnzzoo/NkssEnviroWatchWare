import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DataAggregationType } from '../../../Interfaces/ReportSubmitFilter';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import * as XLSX from 'xlsx';

interface DataReport {
  [key: string]: any;
}

@Component({
  selector: 'app-data-report',
  imports: [CommonModule, TableModule, MenuModule, ButtonModule],
  templateUrl: './data-report.component.html',
  styleUrl: './data-report.component.css'
})
export class DataReportComponent implements OnInit {
  @Input() data: any; // Input for report data
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
      ['Interval', this.getAggregationTypeName(this.aggregationType)],
      []
    ];

    const tableData = this.data.map((row: DataReport) => {
      return this.columns.map(col => row[col.field]);
    });

    const columnHeaders = this.columns.map(col => col.header);

    const finalData = [...extraRows, columnHeaders, ...tableData];

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(finalData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Data Report': worksheet },
      SheetNames: ['Data Report']
    };
    XLSX.writeFile(workbook, 'data_report.xlsx');
  }
  getAggregationTypeName(value: number): string {
    return DataAggregationType[value] || 'Unknown';
  }

}
