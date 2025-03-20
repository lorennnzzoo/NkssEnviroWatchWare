import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProtocolService } from '../../Services/protocol.service';
import { AnalyzerCreation } from '../../Interfaces/Protocol';
import { CommonModule, Location } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-instrument',
  imports: [ReactiveFormsModule,
    CommonModule, ToastrModule],
  templateUrl: './add-instrument.component.html',
  styleUrl: './add-instrument.component.css',
  providers: [ToastrService]
})
export class AddInstrumentComponent implements OnInit {
  protocolForm!: FormGroup; // Reactive form for company creation
  Loading: boolean = false;
  BaudRates: string[] = ['1200', '2400', '4800', '9600', '14400', '19200', '38400', '57600', '115200', '256000'];
  Parity: string[] = ['NONE', 'EVEN', 'ODD', 'MARK', 'SPACE'];
  DataBits: number[] = [5, 6, 7, 8];
  StopBits: number[] = [1, 1.5, 2];

  CommunicationTypes: string[] = ['C', 'IP', 'UDP']
  constructor(
    private fb: FormBuilder,
    private toastService: ToastrService,
    private protocolService: ProtocolService,
    private location: Location
  ) {

  }
  ngOnInit(): void {
    this.protocolForm = this.fb.group({
      ProtocolType: [null, Validators.required],
      CommunicationType: [null, Validators.required],
      Command: [null, Validators.required],
      ComPort: [null],
      BaudRate: [null],
      Parity: [null],
      DataBits: [null],
      StopBits: [null],
      IpAddress: [null],
      Port: [null],
      Manufacturer: [null, Validators.required],
      Model: [null, Validators.required],
    });

    this.protocolForm.get('CommunicationType')?.valueChanges.subscribe(value => {
      const comPortControl = this.protocolForm.get('ComPort');
      const baudRateControl = this.protocolForm.get('BaudRate');
      const parityControl = this.protocolForm.get('Parity');
      const dataBitsControl = this.protocolForm.get('DataBits');
      const stopBitsControl = this.protocolForm.get('StopBits');
      const ipAddressControl = this.protocolForm.get('IpAddress');
      const portControl = this.protocolForm.get('Port');

      // If CommunicationType is 'C', show COM related fields and require them
      if (value === 'C') {
        comPortControl?.setValidators([Validators.required]);
        baudRateControl?.setValidators([Validators.required]);
        parityControl?.setValidators([Validators.required]);
        dataBitsControl?.setValidators([Validators.required]);
        stopBitsControl?.setValidators([Validators.required]);

        ipAddressControl?.clearValidators(); // Clear IP related validators
        portControl?.clearValidators(); // Clear port related validators
        ipAddressControl?.setValue(null); // Reset value
        portControl?.setValue(null); // Reset value
      } else if (value === 'IP' || value === 'UDP') {
        ipAddressControl?.setValidators([Validators.required, Validators.pattern(/^(\d{1,3}\.){3}\d{1,3}$/)]);
        portControl?.setValidators([Validators.required, Validators.min(1), Validators.max(65535)]);

        comPortControl?.clearValidators(); // Clear COM related validators
        baudRateControl?.clearValidators(); // Clear baud rate related validators
        parityControl?.clearValidators(); // Clear parity related validators
        dataBitsControl?.clearValidators(); // Clear data bits related validators
        stopBitsControl?.clearValidators(); // Clear stop bits related validators
        comPortControl?.setValue(null); // Reset value
        baudRateControl?.setValue(null); // Reset value
        parityControl?.setValue(null); // Reset value
        dataBitsControl?.setValue(null); // Reset value
        stopBitsControl?.setValue(null); // Reset value
      }

      // Update validity of all fields after changes
      comPortControl?.updateValueAndValidity();
      baudRateControl?.updateValueAndValidity();
      parityControl?.updateValueAndValidity();
      dataBitsControl?.updateValueAndValidity();
      stopBitsControl?.updateValueAndValidity();
      ipAddressControl?.updateValueAndValidity();
      portControl?.updateValueAndValidity();
    });
  }

  goBack() {
    this.location.back();
  }
  onSubmit() {
    this.Loading = true;

    // Check if the form is invalid
    if (this.protocolForm.invalid) {

      this.toastService.warning('Please fill all required fields', 'Warning');
      this.Loading = false;
      return;
    }


    const protocol: AnalyzerCreation = {
      ProtocolType: this.protocolForm.value.ProtocolType,
      CommunicationType: this.protocolForm.value.CommunicationType,
      Command: this.protocolForm.value.Command,
      ComPort: this.protocolForm.value.ComPort,
      BaudRate: this.protocolForm.value.BaudRate,
      Parity: this.protocolForm.value.Parity,
      DataBits: this.protocolForm.value.DataBits,
      StopBits: this.protocolForm.value.StopBits,
      IpAddress: this.protocolForm.value.IpAddress,
      Port: this.protocolForm.value.Port,
      Manufacturer: this.protocolForm.value.Manufacturer,
      Model: this.protocolForm.value.Model,
    };


    this.protocolService.CreateProtocol(protocol).subscribe({
      next: (response) => {

        this.toastService.success('Analyzer created successfully', 'Created');
        this.Loading = false;
        this.protocolForm.reset(); // Reset the form
        this.ngOnInit();
      },
      error: (error) => {

        this.toastService.error(error.error, 'Error');
        this.Loading = false;
      }
    })
  }

}
