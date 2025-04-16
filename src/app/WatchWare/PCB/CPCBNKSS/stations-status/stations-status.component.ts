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
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { UploadSettings } from '../../../Interfaces/PCB/UploadSettings';

@Component({
  selector: 'app-stations-status',
  imports: [ToastrModule, TableModule, TagModule, ReactiveFormsModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, ConfirmDialogModule, DialogModule],
  templateUrl: './stations-status.component.html',
  styleUrl: './stations-status.component.css',
  providers: [ToastrService, ConfirmationService]
})
export class StationsStatusComponent implements OnInit {


  StationConfigurations: StationConfiguration[] = [];
  StationConfigurationsLoading: boolean = false;
  ShowUploadOptions: boolean = false;
  uploadOptionLoading: boolean = false;
  uploadForm!: FormGroup;
  uploadFormLoading: boolean = false;

  constructor(private toastService: ToastrService, private pcbService: PCBService, private router: Router, private fb: FormBuilder, private dialogService: ConfirmationService) { }
  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      liveUrl: ['', Validators.required],
      delayUrl: ['', Validators.required],
      liveInterval: [60, [Validators.required, Validators.min(60)]],
      delayInterval: [60, [Validators.required, Validators.min(60)]],
      liveNumberOfRecords: [1, [Validators.required, Validators.min(1)]],
      delayNumberOfRecords: [1, [Validators.required, Validators.min(1)]],
    });
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
  saveUploadSettings() {
    this.uploadOptionLoading = true;
    if (!this.uploadForm.valid) {
      this.toastService.warning('Please fill all required fields', 'Warning');
      this.uploadOptionLoading = false;
      this.uploadForm.markAllAsTouched();
      return;
    }
    const uploadSettings: UploadSettings = {
      LiveUrl: this.uploadForm.value.liveUrl,
      DelayUrl: this.uploadForm.value.delayUrl,
      LiveInterval: this.uploadForm.value.liveInterval,
      DelayInterval: this.uploadForm.value.delayInterval,
      LiveRecords: this.uploadForm.value.liveNumberOfRecords,
      DelayRecords: this.uploadForm.value.delayNumberOfRecords,
    }



    this.pcbService.UpdateCPCBUploadSettings(uploadSettings).subscribe({
      next: (response) => {
        this.toastService.success('Updated successfully.');
        this.uploadOptionLoading = false;
        this.ShowUploadOptions = false;
      },
      error: (error) => {
        this.uploadOptionLoading = false;
        console.error(error);
        this.toastService.error(error.error);
      }
    })
  }
  closeUploadSettingsForm() {
    this.ShowUploadOptions = false;
  }
  showUploadSettingsForm() {
    this.ShowUploadOptions = true;
    this.uploadFormLoading = true;
    this.pcbService.GetCPCBUploadSettings().subscribe({
      next: (settings) => {
        this.uploadForm.patchValue({
          liveUrl: settings.LiveUrl,
          delayUrl: settings.DelayUrl,
          liveInterval: settings.LiveInterval,
          delayInterval: settings.DelayInterval,
          liveNumberOfRecords: settings.LiveRecords,
          delayNumberOfRecords: settings.DelayRecords
        })
        this.uploadFormLoading = false;
      },
      error: (error) => {
        this.uploadFormLoading = false;
        console.error(error);
        this.toastService.error("unable to load upload settings");
      }
    })
  }
}
