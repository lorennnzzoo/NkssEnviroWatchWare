import { Component, OnInit } from '@angular/core';
import { DataAggregationType, ReportFilter, ReportType } from '../../Interfaces/ReportSubmitFilter';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReportService } from '../../Services/report.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SelectionModel } from '../../Interfaces/ReportSelection';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DatePickerModule } from 'primeng/datepicker'
import { AvailabilityComponent } from '../Result/availability/availability.component';
import { DataReportComponent } from '../Result/data-report/data-report.component';
import { ExceedanceComponent } from '../Result/exceedance/exceedance.component';
import { TrendsComponent } from '../Result/trends/trends.component';

@Component({
  selector: 'app-selection',
  imports: [ToastrModule, ReactiveFormsModule, CommonModule, NgMultiSelectDropDownModule, FormsModule, DatePickerModule, AvailabilityComponent, DataReportComponent, ExceedanceComponent, TrendsComponent],
  templateUrl: './selection.component.html',
  styleUrl: './selection.component.css',
  providers: [ToastrService]
})
export class SelectionComponent implements OnInit {


  reportFilterForm!: FormGroup;

  // Options for dropdowns
  dataAggregationOptions = [
    { label: 'Raw', value: DataAggregationType.Raw },
    { label: '5 Min', value: DataAggregationType.FiveMin },
    { label: '15 Min', value: DataAggregationType.FifteenMin },
    { label: '30 Min', value: DataAggregationType.ThirtyMin },
    { label: '1 Hour', value: DataAggregationType.OneHour },
    { label: '1 Day', value: DataAggregationType.Day }
  ];

  reportTypeOptions = [
    { label: 'Data Availability', value: ReportType.DataAvailability },
    { label: 'Data Report', value: ReportType.DataReport },
    { label: 'Exceedance', value: ReportType.Exceedance },
    // { label: 'Windrose', value: ReportType.Windrose },
    { label: 'Trends', value: ReportType.Trends }
  ];

  selectedItems = {
    companies: new Map<number, { checked: boolean | null }>(),
    stations: new Map<number, { checked: boolean | null }>(),
    channels: new Map<number, { checked: boolean }>()
  };


  loading: boolean = false;
  reportData: any;
  public ReportType = ReportType;
  selectionModel!: SelectionModel;
  constructor(private reportService: ReportService, private fb: FormBuilder, private toastService: ToastrService) { }

  ngOnInit(): void {
    this.loadSelectionModel();
    this.reportFilterForm = this.fb.group({
      DataAggregationType: [DataAggregationType.Raw, Validators.required],
      From: [new Date(new Date().setSeconds(0)), Validators.required],
      To: [new Date(new Date().setHours(23, 59, 0)), Validators.required],
      ReportType: [ReportType.DataAvailability, Validators.required]
    });
  }

  initializeSelectionState() {
    // Clear previous selection states
    this.selectedItems.companies.clear();
    this.selectedItems.stations.clear();
    this.selectedItems.channels.clear();

    this.selectionModel.Companies.forEach(company => {
      let companyChecked = false; // Assume unchecked
      let companyIndeterminate = false;

      company.Stations.forEach(station => {
        let stationChecked = false; // Assume unchecked
        let stationIndeterminate = false;

        station.Channels.forEach(channel => {
          this.selectedItems.channels.set(channel.Id, { checked: false }); // Default to unchecked
        });

        // Assign default state for stations
        this.selectedItems.stations.set(station.Id, { checked: stationChecked ? true : stationIndeterminate ? null : false });
      });

      // Assign default state for companies
      this.selectedItems.companies.set(company.Id, { checked: companyChecked ? true : companyIndeterminate ? null : false });
    });
  }


  expandedCompanies = new Set<number>();
  expandedStations = new Set<number>();
  toggleCompany(companyId: number) {
    if (this.expandedCompanies.has(companyId)) {
      this.expandedCompanies.delete(companyId);
    } else {
      this.expandedCompanies.add(companyId);
    }
  }

  toggleStation(stationId: number) {
    if (this.expandedStations.has(stationId)) {
      this.expandedStations.delete(stationId);
    } else {
      this.expandedStations.add(stationId);
    }
  }

  loadSelectionModel() {
    this.reportService.GetSelectionModel().subscribe({
      next: (model) => {
        this.selectionModel = model;
        this.initializeSelectionState();
      },
      error: (error) => {
        this.toastService.error('Unable to load selection parameters.', 'Error');
      }
    })
  }

  onCompanyCheckChange(companyId: number) {
    const companyChecked = !(this.selectedItems.companies.get(companyId)?.checked ?? false);
    this.selectedItems.companies.set(companyId, { checked: companyChecked });

    const company = this.selectionModel.Companies.find(c => c.Id === companyId);
    if (company) {
      company.Stations.forEach(station => {
        this.selectedItems.stations.set(station.Id, { checked: companyChecked });
        station.Channels.forEach(channel => {
          this.selectedItems.channels.set(channel.Id, { checked: companyChecked });
        });
      });
    }
  }

  onStationCheckChange(stationId: number, companyId: number) {
    const stationChecked = !(this.selectedItems.stations.get(stationId)?.checked ?? false);
    this.selectedItems.stations.set(stationId, { checked: stationChecked });

    const company = this.selectionModel.Companies.find(c => c.Id === companyId);
    const station = company?.Stations.find(s => s.Id === stationId);
    if (station) {
      station.Channels.forEach(channel => {
        this.selectedItems.channels.set(channel.Id, { checked: stationChecked });
      });
    }

    this.updateSelectionStateForStation(stationId, companyId);
  }
  onChannelCheckChange(channelId: number, stationId: number, companyId: number) {
    const channelChecked = !(this.selectedItems.channels.get(channelId)?.checked ?? false);
    this.selectedItems.channels.set(channelId, { checked: channelChecked });

    this.updateSelectionStateForStation(stationId, companyId);
  }
  updateSelectionStateForStation(stationId: number, companyId: number) {
    const company = this.selectionModel.Companies.find(c => c.Id === companyId);
    const station = company?.Stations.find(s => s.Id === stationId);
    if (!station) return;

    const channelStates = station.Channels.map(c => this.selectedItems.channels.get(c.Id)?.checked ?? false);

    if (channelStates.every(state => state === true)) {
      this.selectedItems.stations.set(stationId, { checked: true });
    } else if (channelStates.some(state => state === true)) {
      this.selectedItems.stations.set(stationId, { checked: null }); // Indeterminate
    } else {
      this.selectedItems.stations.set(stationId, { checked: false });
    }

    this.updateSelectionStateForCompany(companyId);
  }

  updateSelectionStateForCompany(companyId: number) {
    const company = this.selectionModel.Companies.find(c => c.Id === companyId);
    if (!company) return;

    const stationStates = company.Stations.map(s => this.selectedItems.stations.get(s.Id)?.checked);

    if (stationStates.every(state => state === true)) {
      this.selectedItems.companies.set(companyId, { checked: true });
    } else if (stationStates.some(state => state === true || state === null)) {
      this.selectedItems.companies.set(companyId, { checked: null }); // Indeterminate
    } else {
      this.selectedItems.companies.set(companyId, { checked: false });
    }
  }

  isModalOpen = false;

  confirmSelection() {
    console.log("Selected Parameters:", this.selectedItems);
    this.isModalOpen = false;
  }


  onFetch(): void {
    if (this.reportData) {
      this.toastService.warning('Please reset the current report before fetching a new one', 'Warning')
      return;
    }

    this.loading = true;


    const reportFilter: ReportFilter = {
      companyId: null,
      stationsId: [],
      channelsId: [],
      dataAggregationType: this.reportFilterForm.value.DataAggregationType,
      reportType: this.reportFilterForm.value.ReportType,
      from: this.reportFilterForm.value.From,
      to: this.reportFilterForm.value.To
    }

    const uniqueStations = new Set<number>();
    let companySet = false;

    // Process selected channels and add their respective stations
    this.selectedItems.channels.forEach((value, channelId) => {
      if (value.checked) {
        reportFilter.channelsId.push(channelId);
      }
    });

    // Process selected stations and add to uniqueStations
    this.selectedItems.stations.forEach((value, stationId) => {
      if (value.checked !== false) {
        uniqueStations.add(stationId);
      }
    });

    // Process companies, ensuring only one company is set
    this.selectedItems.companies.forEach((value, companyId) => {
      if (value.checked !== false && !companySet) {
        reportFilter.companyId = companyId;
        companySet = true;
      }
    });

    reportFilter.stationsId = Array.from(uniqueStations);

    console.log('report filter:', reportFilter);
    console.log('companyId:', reportFilter.companyId);
    console.log('stationsId:', reportFilter.stationsId);
    console.log('channelsId:', reportFilter.channelsId);

    if (reportFilter.companyId === null) {
      this.toastService.warning('Please select parameters', 'Warning')
      this.loading = false;
    }
    else {
      this.getReport(reportFilter);
    }
  }
  resetReport(): void {
    this.reportData = null;
    this.reportFilterForm.get('ReportType')?.enable();
    this.reportFilterForm.get('From')?.enable();
    this.reportFilterForm.get('To')?.enable();
    this.reportFilterForm.get('DataAggregationType')?.enable();
    // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Report data cleared' });
  }
  getReport(filter: ReportFilter) {
    this.reportService.GetDataReport(filter).subscribe(
      {
        next: (report) => {
          this.reportData = report;
          console.log(this.reportData);
          // this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Report Data Fetched successfully' }); 
          this.reportFilterForm.get('ReportType')?.disable({ emitEvent: false, onlySelf: true });
          this.reportFilterForm.get('From')?.disable({ emitEvent: false, onlySelf: true });
          this.reportFilterForm.get('To')?.disable({ emitEvent: false, onlySelf: true });
          this.reportFilterForm.get('DataAggregationType')?.disable({ emitEvent: false, onlySelf: true });
          this.loading = false;
        },
        error: (error) => {
          this.toastService.error(error.error, "Error");
          this.loading = false;
        }
      }
    )
  }
}
