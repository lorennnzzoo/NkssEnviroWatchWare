import { Component, OnInit } from '@angular/core';
import { Station, StationListView } from '../../Interfaces/Station';
import { MonitoringTypeService } from '../../Services/monitoring-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StationService } from '../../Services/station.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-stations',
  imports: [TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule],
  templateUrl: './list-stations.component.html',
  styleUrl: './list-stations.component.css'
})
export class ListStationsComponent implements OnInit {

  RawStations: Station[] = [];
  Stations: StationListView[] = [];
  Loading: boolean = false;
  companyId!: number;

  constructor(private stationService: StationService,
    private toastService: ToastrService,
    private route: ActivatedRoute,
    private router: Router, // Inject Router
    private monitoringTypeService: MonitoringTypeService) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.companyId = +id; // Convert string to number
        this.loadStations(this.companyId);
      }
    });
  }
  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  loadStations(id: number) {
    this.Loading = true;
    this.stationService.GetAllStationsByCompany(id).subscribe(
      (data) => {
        console.log(data);
        this.RawStations = data;

        // Create an array to store promises for fetching MonitoringType
        const monitoringTypePromises = this.RawStations.map(station => {
          return this.monitoringTypeService.GetMonitoringType(station.MonitoringTypeId).toPromise().then(monitoringType => {
            // Convert Station to StationListView with MonitoringTypeName
            const monitoringTypeName = monitoringType ? monitoringType.MonitoringTypeName : 'Unknown Monitoring Type';
            const stationListView: StationListView = {
              Id: station.Id,
              CompanyId: station.CompanyId,
              MonitoringType: monitoringTypeName, // Replacing MonitoringTypeId with MonitoringTypeName
              Name: station.Name,
              IsSpcb: station.IsSpcb,
              IsCpcb: station.IsCpcb,
              Active: station.Active,
              CreatedOn: station.CreatedOn
            };
            return stationListView;
          });
        });

        // Wait for all promises to resolve and update stations
        Promise.all(monitoringTypePromises).then(updatedStations => {
          this.Stations = updatedStations;
          this.Loading = false;
        }).catch(error => {
          // this.messageService.add({
          //   severity: 'error',
          //   summary: 'Error Loading Monitoring Types',
          //   detail: 'An error occurred while loading the monitoring types. Please try again later.'
          // });
          this.toastService.error('Unable loading Monitoring Types', 'Error')
          console.error('Error loading monitoring types:', error);
          this.Loading = false;
        });
      },
      (error) => {
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Error Loading Stations',
        //   detail: 'An error occurred while loading the stations. Please try again later.'
        // });
        this.toastService.error('Unable loading Stations', 'Error')
        console.error('Error loading stations:', error);
        this.Loading = false;
      }
    );
  }
  onChannels(station: StationListView) {
    this.router.navigate(['Channels', station.Id])
  }
}
