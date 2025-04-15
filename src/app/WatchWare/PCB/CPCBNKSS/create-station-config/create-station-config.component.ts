import { Component, OnInit } from '@angular/core';
import { Station } from '../../../Interfaces/Station';
import { StationService } from '../../../Services/station.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { PCBService } from '../../../Services/pcb.service';
import { StationConfiguration, StationConfigurationCreate } from '../../../Interfaces/PCB/CPCB/Configurations';

@Component({
  selector: 'app-create-station-config',
  imports: [ToastrModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-station-config.component.html',
  styleUrl: './create-station-config.component.css',
  providers: [ToastrService]
})
export class CreateStationConfigComponent implements OnInit {

  Stations: Station[] = []
  StationsLoading: boolean = false;
  Loading: boolean = false;
  StationConfigForm!: FormGroup;

  constructor(private stationService: StationService, private toastService: ToastrService, private fb: FormBuilder, private location: Location, private pcbService: PCBService) { }

  ngOnInit(): void {
    this.StationConfigForm = this.fb.group({
      StationId: [null, Validators.required],
      CPCB_StationId: [null, Validators.required],
      CPCB_UserName: [null, Validators.required],
      CPCB_Password: [null, Validators.required]
    })
    this.loadStations();
  }

  loadStations() {
    this.StationsLoading = true;
    this.stationService.GetAllStations().subscribe({
      next: (response) => {
        this.Stations = response;
        this.StationsLoading = false;
      },
      error: (error) => {
        this.StationsLoading = false;
        console.error(error);
        this.toastService.error("unable to fetch stations");
      }
    })
  }
  onSubmit() {
    this.Loading = true;
    if (!this.StationConfigForm.valid) {
      this.toastService.warning('Please fill all required fields', 'Warning');
      this.Loading = false;
      return;
    }
    const config: StationConfigurationCreate = {
      StationId: this.StationConfigForm.value.StationId,
      CPCB_StationId: this.StationConfigForm.value.CPCB_StationId,
      CPCB_UserName: this.StationConfigForm.value.CPCB_UserName,
      CPCB_Password: this.StationConfigForm.value.CPCB_Password,
    }

    this.pcbService.CreateCPCBStationConfiguration(config).subscribe({
      next: (response) => {
        this.Loading = false;
        this.toastService.success("Config created successfully");
        this.goBack();
      },
      error: (error) => {
        this.Loading = false;
        console.error(error);
        this.toastService.error(error.error);
      }
    })
  }
  goBack() {
    this.location.back();
  }
}
