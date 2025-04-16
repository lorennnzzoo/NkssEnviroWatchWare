import { Component, OnInit } from '@angular/core';
import { StationService } from '../../../Services/station.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Station } from '../../../Interfaces/Station';
import { StationConfiguration } from '../../../Interfaces/PCB/CPCB/Configurations';
import { PCBService } from '../../../Services/pcb.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-stations-status',
  imports: [ToastrModule, TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, ConfirmDialogModule],
  templateUrl: './stations-status.component.html',
  styleUrl: './stations-status.component.css',
  providers: [ToastrService, ConfirmationService]
})
export class StationsStatusComponent implements OnInit {


  StationConfigurations: StationConfiguration[] = [];
  StationConfigurationsLoading: boolean = false;

  constructor(private toastService: ToastrService, private pcbService: PCBService, private router: Router, private dialogService: ConfirmationService) { }
  ngOnInit(): void {
    this.loadStationConfigurations();
  }


  loadStationConfigurations() {
    this.StationConfigurationsLoading = true;
    this.pcbService.GetCPCBStationConfigurations().subscribe({
      next: (response) => {
        this.StationConfigurationsLoading = false;
        this.StationConfigurations = response;
      },
      error: (error) => {
        this.StationConfigurationsLoading = false;
        console.error(error);
        this.toastService.error("unable to load station configurations");
      }
    })
  }
  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  onCreate() {
    this.router.navigate(['/PCB/CPCBNKSS/Uploading/CreateStationConfig']);
  }
  onEdit(configuration: StationConfiguration) {
    this.router.navigate(['/PCB/CPCBNKSS/Uploading/EditStationConfig', configuration.Id]);
  }
  onDelete(configuration: StationConfiguration) {
    this.dialogService.confirm({
      message: 'Are you sure you want to delete this configuration?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // User clicked "Yes"
        this.pcbService.DeleteCPCBStationConfiguration(configuration.Id).subscribe
          ({
            next: (response) => {
              this.toastService.success('configuration deleted successfully', 'Deleted');
              this.ngOnInit();
            },
            error: (error) => {
              this.toastService.error(error.error, 'Unable To Delete configuration');
            }
          })
      },
      reject: () => {
        // User clicked "No"

      },
    });
  }
  onChannels(configuration: StationConfiguration) {
    this.router.navigate(['/PCB/CPCBNKSS/Uploading/ChannelsStatus', configuration.StationId]);
  }
}
