import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Channel } from '../../../Interfaces/Channel';
import { ChannelService } from '../../../Services/channel.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChannelConfigurationCreate } from '../../../Interfaces/PCB/CPCB/Configurations';
import { PCBService } from '../../../Services/pcb.service';

@Component({
  selector: 'app-create-channel-config',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-channel-config.component.html',
  styleUrl: './create-channel-config.component.css'
})
export class CreateChannelConfigComponent implements OnInit {
  stationId!: number;
  Channels: Channel[] = []
  Loading: boolean = false;
  ChannelConfigForm!: FormGroup;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private location: Location, private pcbService: PCBService, private channelService: ChannelService, private toastService: ToastrService) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.stationId = +id;
        this.loadChannelsOfStation(this.stationId);
      }
    });

    this.ChannelConfigForm = this.fb.group({
      ChannelId: [null, Validators.required],
      CPCB_ChannelId: [null, Validators.required],
      CPCB_ChannelName: [null, Validators.required],
      CPCB_Units: [null, Validators.required]
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
  onSubmit() {
    this.Loading = true;
    if (!this.ChannelConfigForm.valid) {
      this.toastService.warning('Please fill all required fields', 'Warning');
      this.Loading = false;
      return;
    }

    const config: ChannelConfigurationCreate = {
      ChannelId: this.ChannelConfigForm.value.ChannelId,
      StationId: this.stationId,
      CPCB_ChannelId: this.ChannelConfigForm.value.CPCB_ChannelId,
      CPCB_ChannelName: this.ChannelConfigForm.value.CPCB_ChannelName,
      CPCB_Units: this.ChannelConfigForm.value.CPCB_Units
    }
    this.pcbService.CreateCPCBChannelConfiguration(config).subscribe({
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
}
