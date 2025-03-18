import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DataAggregationType } from '../../../Interfaces/ReportSubmitFilter';

@Component({
  selector: 'app-data-report',
  imports: [CommonModule],
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
  onExportPdf() {
    throw new Error('Method not implemented.');
  }
  onExportExcel() {
    throw new Error('Method not implemented.');
  }
  getAggregationTypeName(value: number): string {
    return DataAggregationType[value] || 'Unknown';
  }

}
