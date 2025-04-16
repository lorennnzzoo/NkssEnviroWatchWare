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

@Component({
  selector: 'app-stations-status',
  imports: [ToastrModule, TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, ConfirmDialogModule],
  templateUrl: './stations-status.component.html',
  styleUrl: './stations-status.component.css',
  providers: [ToastrService]
})
export class StationsStatusComponent implements OnInit {


  StationConfigurations: StationConfiguration[] = [];
  StationConfigurationsLoading: boolean = false;

  constructor(private toastService: ToastrService, private pcbService: PCBService, private router: Router) { }
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

  }
  onDelete(configuration: StationConfiguration) {

  }
  onChannels(configuration: StationConfiguration) {
    this.router.navigate(['/PCB/CPCBNKSS/Uploading/ChannelsStatus', configuration.StationId]);
  }
}
