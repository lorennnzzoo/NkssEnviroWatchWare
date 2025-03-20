import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ScalingFactorService } from '../../Services/scaling-factor.service';
import { ActivatedRoute } from '@angular/router';
import { ScalingFactorEdit } from '../../Interfaces/ScalingFactor';

@Component({
  selector: 'app-edit-scaling-factor',
  imports: [CommonModule, ReactiveFormsModule, ToastrModule],
  templateUrl: './edit-scaling-factor.component.html',
  styleUrl: './edit-scaling-factor.component.css',
  providers: [ToastrService]
})
export class EditScalingFactorComponent implements OnInit {
  scalingFactorId!: number;
  scalingFactorForm!: FormGroup; // Reactive form for company creation
  Loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toastService: ToastrService,
    private scalingFactorService: ScalingFactorService,
    private route: ActivatedRoute,
    private location: Location
  ) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.scalingFactorId = +id;
        this.loadScalingFactorData(this.scalingFactorId);
      }
    });

    this.scalingFactorForm = this.fb.group({
      Id: [null, Validators.required],
      MinInput: [null, Validators.required],
      MaxInput: [null, Validators.required],
      MinOutput: [null, Validators.required],
      MaxOutput: [null, Validators.required]
    });
  }


  loadScalingFactorData(id: number) {
    this.scalingFactorService.GetScalingFactorById(id).subscribe({
      next: (data) => {
        this.scalingFactorForm.patchValue({
          Id: data.Id,
          MinInput: data.MinInput,
          MaxInput: data.MaxInput,
          MinOutput: data.MinOutput,
          MaxOutput: data.MaxOutput,
        })
      },
      error: () => {
        this.toastService.error('Unable To Load Scaling Factor Details', 'Error');
        this.location.back();
      }
    })
  }
  goBack() {
    this.location.back();
  }
  onSubmit() {
    this.Loading = true;

    // Check if the form is invalid
    if (this.scalingFactorForm.invalid) {

      this.toastService.warning('Please fill all the required fields', 'Warning');
      this.Loading = false;
      return;
    }

    const scalingFactor: ScalingFactorEdit = {
      Id: this.scalingFactorForm.value.Id,
      MinInput: this.scalingFactorForm.value.MinInput,
      MaxInput: this.scalingFactorForm.value.MaxInput,
      MinOutput: this.scalingFactorForm.value.MinOutput,
      MaxOutput: this.scalingFactorForm.value.MaxOutput,
    };

    this.scalingFactorService.EditScalingFactor(scalingFactor).subscribe({
      next: (response) => {
        this.toastService.success('Scaling Factor updated successfully', 'Updated');
        this.Loading = false; // Reset the form
        this.location.back();
      },
      error: (error) => {
        // Handle error response
        this.toastService.error(error.error, 'Error');
        this.Loading = false;
      },
    })
  }
}
