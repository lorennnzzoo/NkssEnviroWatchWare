import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Analyzer } from '../../Interfaces/Protocol';
import { Oxide } from '../../Interfaces/Oxide';
import { ChannelType } from '../../Interfaces/ChannelType';
import { ScalingFactor } from '../../Interfaces/ScalingFactor';
import { ChannelService } from '../../Services/channel.service';
import { ProtocolService } from '../../Services/protocol.service';
import { OxideService } from '../../Services/oxide.service';
import { ChannelTypeService } from '../../Services/channel-type.service';
import { ScalingFactorService } from '../../Services/scaling-factor.service';
import { ActivatedRoute } from '@angular/router';
import { ChannelEdit } from '../../Interfaces/Channel';

@Component({
  selector: 'app-edit-channel',
  imports: [ToastrModule, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.css',
  providers: [ToastrService]
})
export class EditChannelComponent implements OnInit {
  channelId!: number;
  protocols: Analyzer[] = [];
  oxides: Oxide[] = [];
  channeltypes: ChannelType[] = [];
  scalingFactors: ScalingFactor[] = [];
  outputTypes: string[] = ['DIGITAL', 'ANALOG'];

  channelForm!: FormGroup; // Reactive form for company creation
  Loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private channelService: ChannelService,
    private toastService: ToastrService,
    private protocolService: ProtocolService,
    private oxideService: OxideService,
    private channelTypeService: ChannelTypeService,
    private scalingFactorService: ScalingFactorService,
    private route: ActivatedRoute,
    private location: Location
  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.channelId = +id;
        this.loadChannelData(this.channelId);
        this.loadProtocols();
        this.loadOxides();
        this.loadChannelTypes();
        this.loadScalingFactors();
      }
    });


    this.channelForm = this.fb.group({
      Id: [null, Validators.required],  // Assuming Id is generated later or updated for existing channels
      StationId: [null, Validators.required],
      Name: ['', Validators.required],
      LoggingUnits: ['', Validators.required],
      ProtocolId: [null, Validators.required],
      ValuePosition: [null, Validators.required],
      MaximumRange: [null, Validators.required],
      MinimumRange: [null, Validators.required],
      Threshold: [null],
      CpcbChannelName: [null],
      SpcbChannelName: [null],
      OxideId: [null, Validators.required],
      Priority: [null, Validators.required],
      IsCpcb: [false, Validators.required],
      IsSpcb: [false, Validators.required],
      ScalingFactorId: [null],
      OutputType: ['', Validators.required],
      ChannelTypeId: [null, Validators.required],
      ConversionFactor: [null, Validators.required],
      CreatedOn: [null, Validators.required]
    });

    this.channelForm.get('OutputType')?.valueChanges.subscribe(value => {
      const scalingFactorControl = this.channelForm.get('ScalingFactorId');
      if (value === 'ANALOG') {
        scalingFactorControl?.setValidators([Validators.required]); // Require when ANALOG
      } else {
        scalingFactorControl?.clearValidators(); // Remove validation otherwise
        scalingFactorControl?.setValue(null); // Reset the value
      }
      scalingFactorControl?.updateValueAndValidity();
    });
  }
  goBack() {
    this.location.back();
  }

  loadChannelData(id: number) {
    this.channelService.GetChannelById(id).subscribe({
      next: (channel) => {
        console.log(channel);
        this.channelForm.patchValue({
          Id: channel.Id,
          StationId: channel.StationId,
          Name: channel.Name,
          LoggingUnits: channel.LoggingUnits,
          ProtocolId: channel.ProtocolId,
          ValuePosition: channel.ValuePosition,
          MaximumRange: channel.MaximumRange,
          MinimumRange: channel.MinimumRange,
          Threshold: channel.Threshold,
          CpcbChannelName: channel.CpcbChannelName,
          SpcbChannelName: channel.SpcbChannelName,
          OxideId: channel.OxideId,
          Priority: channel.Priority,
          IsSpcb: channel.IsSpcb,
          IsCpcb: channel.IsCpcb,
          ScalingFactorId: channel.ScalingFactorId,
          OutputType: channel.OutputType,
          ChannelTypeId: channel.ChannelTypeId,
          ConversionFactor: channel.ConversionFactor,
          CreatedOn: channel.CreatedOn,
        });
      },
      error: () => {
        this.toastService.error('Unable To Load Channel Details', 'Error');
        this.location.back();
      },
    });
  }
  loadProtocols() {
    this.protocolService.GetAllProtocols().subscribe({
      next: (response) => {
        this.protocols = response;
      },
      error: (error) => {

        this.toastService.error('Unable To Load Analyzer Details Of Channel', 'Error');
        console.error('Error loading analyzers:', error);
        this.location.back();
      }
    })
  }
  loadOxides() {
    this.oxideService.GetAllOxides().subscribe({
      next: (response) => {
        this.oxides = response;
      },
      error: (error) => {

        this.toastService.error('Unable To Load Oxide Details Of Channel', 'Error');
        console.error('Error loading oxides:', error);
        this.location.back();
      }
    })
  }
  loadChannelTypes() {
    this.channelTypeService.GetAllChannelTypes().subscribe({
      next: (response) => {
        this.channeltypes = response;
      },
      error: (error) => {

        this.toastService.error('Unable To Load Channel Type Details Of Channel', 'Error');
        console.error('Error loading channel types:', error);
        this.location.back();
      }
    })
  }
  loadScalingFactors() {
    this.scalingFactorService.GetAllScalingFactors().subscribe({
      next: (response) => {
        // Map through the response to add a custom label
        this.scalingFactors = response.map(factor => ({
          ...factor,
          customLabel: `MinInput: ${factor.MinInput}, MaxInput: ${factor.MaxInput}, MinOutput: ${factor.MinOutput}, MaxOutput: ${factor.MaxOutput}`
        }));
      },
      error: (error) => {

        this.toastService.error('Unable To Load Scaling Factor Details Of Channel', 'Error');
        console.error('Error loading scaling factors:', error);
        this.location.back();
      }
    });
  }



  onSubmit() {
    this.Loading = true;

    // Check if the form is invalid
    if (this.channelForm.invalid) {

      this.toastService.warning('Please fill all required fields', 'Warning');
      this.Loading = false;
      return;
    }

    const channel: ChannelEdit = {
      Id: this.channelForm.value.Id,
      StationId: this.channelForm.value.StationId,
      Name: this.channelForm.value.Name,
      LoggingUnits: this.channelForm.value.LoggingUnits,
      ProtocolId: this.channelForm.value.ProtocolId,
      ValuePosition: this.channelForm.value.ValuePosition,
      MaximumRange: this.channelForm.value.MaximumRange,
      MinimumRange: this.channelForm.value.MinimumRange,
      Threshold: this.channelForm.value.Threshold,
      CpcbChannelName: this.channelForm.value.CpcbChannelName,
      SpcbChannelName: this.channelForm.value.SpcbChannelName,
      OxideId: this.channelForm.value.OxideId,
      Priority: this.channelForm.value.Priority,
      IsSpcb: this.channelForm.value.IsSpcb,
      IsCpcb: this.channelForm.value.IsCpcb,
      ScalingFactorId: this.channelForm.value.ScalingFactorId,
      OutputType: this.channelForm.value.OutputType,
      ChannelTypeId: this.channelForm.value.ChannelTypeId,
      ConversionFactor: this.channelForm.value.ConversionFactor,
      CreatedOn: this.channelForm.value.CreatedOn
    };

    this.channelService.EditChannel(channel).subscribe({
      next: (response) => {
        // Handle successful response

        this.toastService.success('Channel updated successfully', 'Updated');
        this.Loading = false; // Reset the form
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
