import { Component, OnInit } from '@angular/core';
import { MonitoringType } from '../../Interfaces/MonitoringType';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MonitoringTypeService } from '../../Services/monitoring-type.service';
import { StationService } from '../../Services/station.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { StationCreation } from '../../Interfaces/Station';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-add-station',
  imports: [CommonModule, ReactiveFormsModule, CheckboxModule, DropdownModule, ToastrModule],
  templateUrl: './add-station.component.html',
  styleUrl: './add-station.component.css',
  providers: [ToastrService]
})
export class AddStationComponent implements OnInit {
  companyId!: number;
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
        this.companyId = +id;
        this.loadMonitoringTypes();
      }
    });
    this.stationForm = this.fb.group({
      CompanyId: [this.companyId, Validators.required],
      Name: ['', Validators.required],
      MonitoringTypeId: [null, Validators.required],
      IsSpcb: [false, Validators.required],
      IsCpcb: [false, Validators.required],
    });

  }
  goBack() {
    this.location.back();
  }

  loadMonitoringTypes() {
    this.monitoringTypeService.GetAllMonitoringTypes().subscribe({
      next: (response) => {
        this.monitoringTypes = response;
      },
      error: (error) => {
        this.toastService.error('Unable To Load Monitoring Types', 'Error');
        console.error('Error loading monitoring types:', error);
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

    const station: StationCreation = {
      CompanyId: this.stationForm.value.CompanyId,
      Name: this.stationForm.value.Name,
      MonitoringTypeId: this.stationForm.value.MonitoringTypeId, // Assuming country is a string, not an object
      IsSpcb: this.stationForm.value.IsSpcb,
      IsCpcb: this.stationForm.value.IsCpcb
    };


    this.stationService.CreateStation(station).subscribe({
      next: (response) => {
        // Handle successful response

        this.toastService.success('Station created successfully', 'Created');
        this.Loading = false;
        this.goBack();
      },
      error: (error) => {
        // Handle error response

        this.toastService.error(error.error, 'Error');
        this.Loading = false;
      },
    });
  }
}
