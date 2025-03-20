import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { OxideService } from '../../Services/oxide.service';
import { ActivatedRoute } from '@angular/router';
import { OxideEdit } from '../../Interfaces/Oxide';

@Component({
  selector: 'app-edit-oxide',
  imports: [CommonModule, ReactiveFormsModule, ToastrModule],
  templateUrl: './edit-oxide.component.html',
  styleUrl: './edit-oxide.component.css',
  providers: [ToastrService]
})
export class EditOxideComponent implements OnInit {
  oxideId!: number;
  oxideForm!: FormGroup; // Reactive form for company creation
  Loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastrService,
    private oxideService: OxideService,
    private route: ActivatedRoute,
    private location: Location
  ) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.oxideId = +id;
        this.loadOxideData(this.oxideId);
      }
    });

    this.oxideForm = this.fb.group({
      Id: [null, Validators.required],
      OxideName: [null, Validators.required],
      Limit: [null, Validators.required],
    });
  }

  loadOxideData(id: number) {
    this.oxideService.GetOxideById(id).subscribe({
      next: (data) => {
        this.oxideForm.patchValue({
          Id: data.Id,
          OxideName: data.OxideName,
          Limit: data.Limit
        })
      },
      error: () => {
        this.toastService.error('Unable To Load Oxide Details', 'Error')
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
    if (this.oxideForm.invalid) {

      this.toastService.warning('Please fill all required fields', 'Warning');
      this.Loading = false;
      return;
    }

    const oxide: OxideEdit = {
      Id: this.oxideForm.value.Id,
      OxideName: this.oxideForm.value.OxideName,
      Limit: this.oxideForm.value.Limit
    };

    this.oxideService.EditOxide(oxide).subscribe({
      next: (response) => {
        this.toastService.success('Oxide updated successfully', 'Updated');
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
