import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ScalingFactorService } from '../../Services/scaling-factor.service';
import { CommonModule, Location } from '@angular/common';
import { ScalingFactorCreation } from '../../Interfaces/ScalingFactor';

@Component({
  selector: 'app-add-scaling-factor',
  imports: [CommonModule, ReactiveFormsModule, ToastrModule],
  templateUrl: './add-scaling-factor.component.html',
  styleUrl: './add-scaling-factor.component.css',
  providers: [ToastrService]
})
export class AddScalingFactorComponent implements OnInit {
  scalingFactorForm!: FormGroup;
  Loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toastService: ToastrService,
    private scalingFactorService: ScalingFactorService,
    private location: Location
  ) {

  }
  ngOnInit(): void {
    this.scalingFactorForm = this.fb.group({
      MinInput: [null, Validators.required],
      MaxInput: [null, Validators.required],
      MinOutput: [null, Validators.required],
      MaxOutput: [null, Validators.required]
    });
  }
  goBack() {
    this.location.back();
  }


  onSubmit() {
    this.Loading = true;

    // Check if the form is invalid
    if (this.scalingFactorForm.invalid) {

      this.toastService.warning('Please fill all required fields', 'Warning');
      this.Loading = false;
      return;
    }

    const scalingFactor: ScalingFactorCreation = {
      MinInput: this.scalingFactorForm.value.MinInput,
      MaxInput: this.scalingFactorForm.value.MaxInput,
      MinOutput: this.scalingFactorForm.value.MinOutput,
      MaxOutput: this.scalingFactorForm.value.MaxOutput
    };


    this.scalingFactorService.CreateScalingFactor(scalingFactor).subscribe(
      {
        next: (response) => {

          this.toastService.success('Scaling Factor created successfully', 'Created');
          this.Loading = false;
          this.scalingFactorForm.reset(); // Reset the form
        },
        error: (error) => {

          this.toastService.error(error.error, 'Error');
          this.Loading = false;
        }
      }
    )
  }
}
