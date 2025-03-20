import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { MonitoringType } from '../../Interfaces/MonitoringType';
import { MonitoringTypeService } from '../../Services/monitoring-type.service';
import { StationService } from '../../Services/station.service';
import { ActivatedRoute } from '@angular/router';
import { StationEdit } from '../../Interfaces/Station';

@Component({
  selector: 'app-edit-station',
  imports: [ToastrModule, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-station.component.html',
  styleUrl: './edit-station.component.css',
  providers: [ToastrService]
})
export class EditStationComponent implements OnInit {
  stationId!: number;
  monitoringTypes: MonitoringType[] = [];
  stationForm!: FormGroup; // Reactive form for company creation
  Loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toastService: ToastrService,
    private monitoringTypeService: MonitoringTypeService,
    private stationService: StationService,
    private route: ActivatedRoute,
    private location: Location
  ) { }
  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.stationId = +id;
        this.loadStationData(this.stationId);
        this.loadMonitoringTypes();
      }
    });
    this.stationForm = this.fb.group({
      Id: [null, Validators.required],
      CompanyId: [null, Validators.required],
      Name: ['', Validators.required],
      MonitoringTypeId: ['', Validators.required],
      IsSpcb: [false, Validators.required],
      IsCpcb: [false, Validators.required],
    });

  }
  goBack() {
    this.location.back();
  }
  loadStationData(id: number): void {
    this.stationService.GetStationById(id).subscribe({
      next: (station) => {
        console.log(station);
        this.stationForm.patchValue({
          Id: station.Id,
          CompanyId: station.CompanyId,
          Name: station.Name,
          MonitoringTypeId: station.MonitoringTypeId,
          IsSpcb: station.IsSpcb,
          IsCpcb: station.IsCpcb
        });
        console.log(this.stationForm.value);
      },
      error: () => {
        this.toastService.error('Unable To Station Details', 'Error');
        this.location.back();
      },
    });
  }
  loadMonitoringTypes() {
    this.monitoringTypeService.GetAllMonitoringTypes().subscribe({
      next: (response) => {
        this.monitoringTypes = response;
      },
      error: (error) => {

        this.toastService.error('Unable To Load Monitoring Types', 'Error');
        console.error('Error loading monitoring types:', error);
        this.location.back();
      }
    })
  }

  onSubmit() {
    this.Loading = true;

    // Check if the form is invalid
    if (this.stationForm.invalid) {
      this.toastService.warning('Please fill all required fields', 'Warning');
      this.Loading = false;
      return;
    }

    const station: StationEdit = {
      Id: this.stationForm.value.Id,
      CompanyId: this.stationForm.value.CompanyId,
      Name: this.stationForm.value.Name,
      MonitoringTypeId: this.stationForm.value.MonitoringTypeId, // Assuming country is a string, not an object
      IsSpcb: this.stationForm.value.IsSpcb,
      IsCpcb: this.stationForm.value.IsCpcb
    };


    this.stationService.EditStation(station).subscribe({
      next: (response) => {
        // Handle successful response

        this.toastService.success('Station updated successfully', 'Updated');
        this.Loading = false;// Reset the form
        this.location.back();
      },
      error: (error) => {
        // Handle error response
        this.toastService.error(error.error, 'Error');
        this.Loading = false;
      },
    });
  }

}
