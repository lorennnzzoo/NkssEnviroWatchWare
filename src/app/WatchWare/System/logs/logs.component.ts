import { Component, OnInit } from '@angular/core';
import { LogService } from '../../Services/log.service';
import { ServiceLogs } from '../../Interfaces/ServiceLog';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'app-logs',
  imports: [ToastrModule, SelectButtonModule, FormsModule, TableModule, TagModule,
    InputIconModule, IconFieldModule,
    RippleModule, CommonModule,
    ButtonModule,
    InputTextModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css',
  providers: [ToastrService]
})
export class LogsComponent implements OnInit {
  Types: any[] = [];
  value!: string;
  Softwares: string[] = [];
  Logs: ServiceLogs[] = [];
  SoftwaresLoading: boolean = false;
  LogsLoading: boolean = false;

  constructor(private logService: LogService, private toastService: ToastrService) { }

  ngOnInit(): void {
    this.loadSoftwares();
  }
  getSeverity(logType: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    switch (logType) {
      case 'WARN': return 'warn';   // Corrected from 'warning' to 'warn'
      case 'ERROR': return 'danger';
      case 'INFO': return 'info';
      default: return 'secondary'; // Default gray if type is unknown
    }
  }

  loadSoftwares() {
    this.SoftwaresLoading = true;
    this.logService.GetSoftwareTypes().subscribe({
      next: (types) => {
        console.log(types);
        this.SoftwaresLoading = false;
        this.Softwares = types;
        this.Types = this.Softwares.map(software => ({ label: software, value: software }));
        if (this.Types.length > 0) {
          this.value = this.Types[0].value;
          this.loadLogs(this.value); // Load logs for default selection
        }
      },
      error: (error) => {
        this.SoftwaresLoading = false;
        console.error(error);
      }
    })
  }

  loadLogs(software: string) {
    if (!software) return;  // Prevent unnecessary API calls
    this.LogsLoading = true;
    this.logService.GetPastLastMinuteLogs(software).subscribe({
      next: (logs) => {
        this.LogsLoading = false;
        this.Logs = logs;
        console.log(this.Logs);
      },
      error: (error) => {
        this.LogsLoading = false;
        console.error(error);
      }
    })
  }
  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}
