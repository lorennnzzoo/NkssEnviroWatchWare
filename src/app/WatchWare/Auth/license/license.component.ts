import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePickerModule } from 'primeng/datepicker';
import { LicenseService } from '../../Services/license.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Registration } from '../../Interfaces/ProductRegister';

@Component({
  selector: 'app-license',
  imports: [CommonModule, ReactiveFormsModule, DatePickerModule, ToastrModule],
  templateUrl: './license.component.html',
  styleUrl: './license.component.css',
  providers: [ToastrService]
})
export class LicenseComponent implements OnInit {
  Loading: boolean = false;
  licenseForm!: FormGroup;
  CompanyNameLoading: boolean = false;
  isInvalidCompanyId: boolean = false;
  constructor(private router: Router, private fb: FormBuilder, private licenseService: LicenseService, private toastService: ToastrService) { }
  ngOnInit(): void {
    this.licenseForm = this.fb.group({
      CompanyId: [null, Validators.required],
      CompanyName: [null, Validators.required],
      Email: [null, Validators.required, Validators.email],
      Phone: [null, [Validators.required, Validators.pattern(/^\d{10}$/), Validators.maxLength(10)]],
      Address: [null, Validators.required],
      State: [null, Validators.required],
      Country: ["India", Validators.required],
      ExpiryDate: [null, Validators.required]
    })
  }

  onLogin() {
    this.router.navigate(['/login']);
  }
  onSubmit() {
    this.Loading = true;
    if (this.licenseForm.invalid) {

      this.toastService.warning('Please fill all required fields', 'Warning');
      this.Loading = false;
      return;
    }

    if (this.isInvalidCompanyId) {
      this.toastService.warning('Please enter valid company id', 'Warning');
      this.Loading = false;
      return;
    }

    const registraion: Registration = {
      CompanyId: this.licenseForm.value.CompanyId,
      Email: this.licenseForm.value.Email,
      Phone: this.licenseForm.value.Phone,
      Address: this.licenseForm.value.Address,
      State: this.licenseForm.value.State,
      Country: this.licenseForm.value.Country,
      ExpiresAt: this.licenseForm.value.ExpiryDate,
    }

    this.licenseService.ProductRegisterSoftrack(registraion).subscribe({
      next: (response) => {
        this.Loading = false;
        this.toastService.success("Registration successfull");
      },
      error: (error) => {
        this.Loading = false;
        this.toastService.warning("Unable to register");
        console.error(error);

      }
    })
  }
  onCompanyIdChange(event: Event) {
    this.licenseForm.patchValue({ CompanyName: "Loading" })
    const inputElement = event.target as HTMLInputElement;
    const companyId = Number(inputElement.value);

    if (companyId) {
      this.loadCompanyName(companyId);
      this.CompanyNameLoading = false;
    }
    else {
      this.licenseForm.patchValue({ CompanyName: null })
    }
  }

  loadCompanyName(id: number) {
    this.licenseService.GetCompanyNameByIdSoftrack(id).subscribe({
      next: (response) => {
        if (response === "Not found") {
          this.isInvalidCompanyId = true;
        }
        this.licenseForm.patchValue({ CompanyName: response })
      },
      error: (error) => {
        console.error(error);
        this.toastService.error("Unable to load company name");
      }
    })
  }
}
