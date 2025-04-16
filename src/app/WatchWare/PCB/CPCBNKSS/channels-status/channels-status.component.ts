import { Component, OnInit } from '@angular/core';
import { ChannelConfiguration } from '../../../Interfaces/PCB/CPCB/Configurations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { PCBService } from '../../../Services/pcb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Station } from '../../../Interfaces/Station';
import { StationService } from '../../../Services/station.service';

@Component({
  selector: 'app-channels-status',
  imports: [ToastrModule, TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, ConfirmDialogModule],
  templateUrl: './channels-status.component.html',
  styleUrl: './channels-status.component.css',
  providers: [ToastrService]
})
export class ChannelsStatusComponent implements OnInit {

  stationId!: number;
  station!: Station;
  ChannelConfigurations: ChannelConfiguration[] = [];
  ChannelConfigurationsLoading: boolean = false;
  constructor(private toastService: ToastrService, private route: ActivatedRoute, private stationService: StationService, private pcbService: PCBService, private router: Router) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.stationId = +id;
        this.loadStationDetails(this.stationId);
        this.loadStationConfigurations(this.stationId);
      }
    });
  }
  loadStationConfigurations(id: number) {
    this.ChannelConfigurationsLoading = true;
    this.pcbService.GetCPCBChannelConfigurationsByStation(id).subscribe({
      next: (response) => {
        this.ChannelConfigurationsLoading = false;
        this.ChannelConfigurations = response;
      },
      error: (error) => {
        this.ChannelConfigurationsLoading = false;
        console.error(error);
        this.toastService.error("unable to load channel configurations");
      }
    })
  }

  loadStationDetails(id: number) {
    this.stationService.GetStationById(id).subscribe({
      next: (data) => {
        this.station = data;
      },
      error: (error) => {
        this.toastService.error('Unable to load station details');
      }

    })
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  onCreate() {
    this.router.navigate(['/PCB/CPCBNKSS/Uploading/CreateChannelConfig', this.stationId]);
  }
  onEdit(configuration: ChannelConfiguration) {

  }
  onDelete(configuration: ChannelConfiguration) {

  }
}
