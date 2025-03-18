import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DataAggregationType } from '../../../Interfaces/ReportSubmitFilter';

@Component({
  selector: 'app-availability',
  imports: [CommonModule],
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.css'
})
export class AvailabilityComponent implements OnInit {
  onExportPdf() {
    throw new Error('Method not implemented.');
  }
  onExportExcel() {
    throw new Error('Method not implemented.');
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
