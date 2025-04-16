import { Component, OnInit } from '@angular/core';
import { Station } from '../../../Interfaces/Station';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StationService } from '../../../Services/station.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { PCBService } from '../../../Services/pcb.service';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StationConfiguration, StationConfigurationEdit } from '../../../Interfaces/PCB/CPCB/Configurations';

@Component({
  selector: 'app-edit-station-config',
  imports: [ToastrModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-station-config.component.html',
  styleUrl: './edit-station-config.component.css',
  providers: [ToastrService]
})
export class EditStationConfigComponent implements OnInit {
  ConfigId!: string;
  Stations: Station[] = []
  StationsLoading: boolean = false;
  Loading: boolean = false;
  StationConfigForm!: FormGroup;

  constructor(private stationService: StationService, private toastService: ToastrService, private fb: FormBuilder, private location: Location, private pcbService: PCBService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.ConfigId = id;
        this.loadConfigurationData(this.ConfigId);
      }
    });
    this.StationConfigForm = this.fb.group({
      Id: [null, Validators.required],
      StationId: [null, Validators.required],
      CPCB_StationId: [null, Validators.required],
      CPCB_UserName: [null, Validators.required],
      CPCB_Password: [null, Validators.required]
    });
    this.loadStations();
  }
  loadConfigurationData(id: string) {
    this.pcbService.GetCPCBStationConfigurationById(id).subscribe({
      next: (config) => {
        this.StationConfigForm.patchValue({
          Id: config.Id,
          StationId: config.StationId,
          CPCB_StationId: config.CPCB_StationId,
          CPCB_UserName: config.CPCB_UserName,
          CPCB_Password: config.CPCB_Password,
        })
      },
      error: (error) => {
        console.error(error);
        this.toastService.error("unable to load configuration data");
      }
    })
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
  goBack() {
    this.location.back();
  }
  onSubmit() {
    this.Loading = true;
    if (!this.StationConfigForm.valid) {
      this.toastService.warning('Please fill all required fields', 'Warning');
      this.Loading = false;
      return;
    }

    const config: StationConfigurationEdit = {
      Id: this.StationConfigForm.value.Id,
      StationId: this.StationConfigForm.value.StationId,
      CPCB_StationId: this.StationConfigForm.value.CPCB_StationId,
      CPCB_UserName: this.StationConfigForm.value.CPCB_UserName,
      CPCB_Password: this.StationConfigForm.value.CPCB_Password
    }

    this.pcbService.UpdateCPCBStationConfiguration(config).subscribe({
      next: (response) => {
        this.toastService.success('Updated successfully.');
        this.Loading = false;
        this.goBack();
      },
      error: (error) => {
        this.Loading = false;
        console.error(error);
        this.toastService.error(error.error);
      }
    })
  }
}
