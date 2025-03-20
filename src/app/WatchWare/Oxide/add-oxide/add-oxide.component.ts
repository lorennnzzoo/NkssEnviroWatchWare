import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { OxideService } from '../../Services/oxide.service';
import { CommonModule, Location } from '@angular/common';
import { OxideCreation } from '../../Interfaces/Oxide';

@Component({
  selector: 'app-add-oxide',
  imports: [CommonModule, ToastrModule, ReactiveFormsModule],
  templateUrl: './add-oxide.component.html',
  styleUrl: './add-oxide.component.css',
  providers: [ToastrService]
})
export class AddOxideComponent implements OnInit {
  oxideForm!: FormGroup;
  Loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toastService: ToastrService,
    private oxideService: OxideService,
    private location: Location
  ) {
  }
  ngOnInit(): void {
    this.oxideForm = this.fb.group({
      OxideName: [null, Validators.required],
      Limit: [null, Validators.required]
    });
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

    const oxide: OxideCreation = {
      OxideName: this.oxideForm.value.OxideName,
      Limit: this.oxideForm.value.Limit
    };

    this.oxideService.CreateOxide(oxide).subscribe(
      {
        next: (response) => {
          this.toastService.success('Oxide created successfully', 'Created');
          this.Loading = false;
          this.oxideForm.reset(); // Reset the form
          this.ngOnInit();
        },
        error: (error) => {

          this.toastService.error(error.error, 'Error');
          this.Loading = false;
        }
      }
    )
  }
}
