import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Channel } from '../../../Interfaces/Channel';
import { ActivatedRoute } from '@angular/router';
import { PCBService } from '../../../Services/pcb.service';
import { ChannelService } from '../../../Services/channel.service';
import { ToastrService } from 'ngx-toastr';
import { ChannelConfigurationEdit } from '../../../Interfaces/PCB/CPCB/Configurations';

@Component({
  selector: 'app-edit-channel-config',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-channel-config.component.html',
  styleUrl: './edit-channel-config.component.css'
})
export class EditChannelConfigComponent implements OnInit {

  configId!: string;
  stationId!: number;
  Channels: Channel[] = []
  Loading: boolean = false;
  ChannelConfigForm!: FormGroup;
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private location: Location, private pcbService: PCBService, private channelService: ChannelService, private toastService: ToastrService) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      const stationId = params.get('stationId');
      if (stationId) {
        this.stationId = +stationId;
        this.loadChannelsOfStation(this.stationId);
      }
      if (id) {
        this.configId = id;
        this.loadConfigurationData(this.configId);
      }
    });

    this.ChannelConfigForm = this.fb.group({
      Id: [null, Validators.required],
      ChannelId: [null, Validators.required],
      CPCB_ChannelId: [null, Validators.required],
      CPCB_ChannelName: [null, Validators.required],
      CPCB_Units: [null, Validators.required]
    })
  }
  loadConfigurationData(id: string) {
    this.pcbService.GetCPCBChannelConfigurationById(id).subscribe({
      next: (config) => {
        this.ChannelConfigForm.patchValue({
          Id: config.Id,
          ChannelId: config.ChannelId,
          CPCB_ChannelId: config.CPCB_ChannelId,
          CPCB_ChannelName: config.CPCB_ChannelName,
          CPCB_Units: config.CPCB_Units,
        });
      }
    })
  }
  onSubmit() {
    this.Loading = true;
    if (!this.ChannelConfigForm.valid) {
      this.toastService.warning('Please fill all required fields', 'Warning');
      this.Loading = false;
      return;
    }

    const config: ChannelConfigurationEdit = {
      Id: this.ChannelConfigForm.value.Id,
      ChannelId: this.ChannelConfigForm.value.ChannelId,
      StationId: this.stationId,
      CPCB_ChannelId: this.ChannelConfigForm.value.CPCB_ChannelId,
      CPCB_ChannelName: this.ChannelConfigForm.value.CPCB_ChannelName,
      CPCB_Units: this.ChannelConfigForm.value.CPCB_Units
    }

    this.pcbService.UpdateCPCBChannelConfiguration(config).subscribe({
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
  loadChannelsOfStation(id: number) {
    this.channelService.GetAllChannelsByStation(id).subscribe({
      next: (response) => {
        this.Channels = response;
      },
      error: (error) => {
        console.error(error);
        this.toastService.error("unable to load channels.")
      }
    })
  }
  goBack() {
    this.location.back();
  }
}
