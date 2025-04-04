import { Component } from '@angular/core';
import { Analyzer } from '../../Interfaces/Protocol';
import { Oxide } from '../../Interfaces/Oxide';
import { ChannelType } from '../../Interfaces/ChannelType';
import { ScalingFactor } from '../../Interfaces/ScalingFactor';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChannelService } from '../../Services/channel.service';
import { ToastrService } from 'ngx-toastr';
import { ProtocolService } from '../../Services/protocol.service';
import { OxideService } from '../../Services/oxide.service';
import { ChannelTypeService } from '../../Services/channel-type.service';
import { ScalingFactorService } from '../../Services/scaling-factor.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ChannelCreation } from '../../Interfaces/Channel';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-add-channel',
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, CheckboxModule, InputTextModule],
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.css'
})
export class AddChannelComponent {
  stationId!: number;
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
        this.stationId = +id;
        this.loadProtocols();
        this.loadOxides();
        this.loadChannelTypes();
        this.loadScalingFactors();
      }
    });


    this.channelForm = this.fb.group({
      StationId: [this.stationId, Validators.required],
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
      ConversionFactor: [null, Validators.required]
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

  loadProtocols() {
    this.protocolService.GetAllProtocols().subscribe({
      next: (response) => {
        this.protocols = response;
      },
      error: (error) => {

        this.toastService.error('Unable To Load Analyzers', 'Error');
        console.error('Error loading analyzers:', error);
      }
    })
  }
  loadOxides() {
    this.oxideService.GetAllOxides().subscribe({
      next: (response) => {
        this.oxides = response;
      },
      error: (error) => {

        this.toastService.error('Unable To Load Oxides', 'Error');
        console.error('Error loading oxides:', error);
      }
    })
  }
  loadChannelTypes() {
    this.channelTypeService.GetAllChannelTypes().subscribe({
      next: (response) => {
        this.channeltypes = response;
      },
      error: (error) => {

        this.toastService.error('Unable To Load Channel Types', 'Error');
        console.error('Error loading channel types:', error);
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

        this.toastService.error('Unable To Load Scaling Factors', 'Error');
        console.error('Error loading scaling factors:', error);
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
    console.log('here');
    const channel: ChannelCreation = {
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
    };
    console.log(channel);
    this.channelService.CreateChannel(channel).subscribe({
      next: (response) => {
        // Handle successful response

        this.toastService.success('Channel created successfully', 'Created');
        this.Loading = false;
        this.channelForm.reset();
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
