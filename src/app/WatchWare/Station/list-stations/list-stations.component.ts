import { Component, OnInit } from '@angular/core';
import { Station, StationListView } from '../../Interfaces/Station';
import { MonitoringTypeService } from '../../Services/monitoring-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { StationService } from '../../Services/station.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Company } from '../../Interfaces/Company';
import { CompanyService } from '../../Services/company.service';

@Component({
  selector: 'app-list-stations',
  imports: [TableModule, TagModule, IconFieldModule, ToastrModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, ConfirmDialogModule],
  templateUrl: './list-stations.component.html',
  styleUrl: './list-stations.component.css',
  providers: [ToastrService, ConfirmationService]
})
export class ListStationsComponent implements OnInit {

  RawStations: Station[] = [];
  Stations: StationListView[] = [];
  Loading: boolean = false;
  companyId!: number;
  company!: Company;

  constructor(private stationService: StationService,
    private dialogService: ConfirmationService,
    private companyService: CompanyService,
    private toastService: ToastrService,
    private route: ActivatedRoute,
    private router: Router, // Inject Router
    private monitoringTypeService: MonitoringTypeService) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.companyId = +id; // Convert string to number
        this.loadCompanyDetails(this.companyId);
        this.loadStations(this.companyId);
      }
    });
  }
  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  loadCompanyDetails(id: number) {
    this.companyService.GetCompanyById(id).subscribe({
      next: (data) => {
        this.company = data;
      },
      error: (error) => {
        this.toastService.error('Unable to fetch company details');
      }
    })
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
  onCreate() {
    this.router.navigate(['/Station/Add', this.companyId])
  }
  onEdit(station: StationListView) {
    this.router.navigate(['/Station/Edit', station.Id]);
  }
  onDelete(staiton: StationListView) {
    this.dialogService.confirm({
      message: 'Are you sure you want to delete this station?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // User clicked "Yes"
        this.stationService.DeleteStation(staiton).subscribe
          ({
            next: (response) => {

              this.toastService.success('Station deleted successfully', 'Deleted');
              this.ngOnInit();
            },
            error: (error) => {
              this.toastService.error('Unable To Delete Station', 'Error');
              console.log(error);
            }
          })
      },
      reject: () => {
        // User clicked "No"

      },
    });
  }
}
