import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePickerModule } from 'primeng/datepicker';
import { LicenseService } from '../../Services/license.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ProductDetails, Registration } from '../../Interfaces/ProductRegister';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-license',
  imports: [CommonModule, ReactiveFormsModule, DatePickerModule, ToastrModule, DialogModule],
  templateUrl: './license.component.html',
  styleUrl: './license.component.css',
  providers: [ToastrService, ConfirmationService]
})
export class LicenseComponent implements OnInit {
  Loading: boolean = false;
  displayDialog = false;
  isExpired: boolean = false;
  licenseForm!: FormGroup;
  ProductDetailsLoading: boolean = false;
  ProductDetails!: ProductDetails;
  constructor(private router: Router, private fb: FormBuilder, private licenseService: LicenseService, private toastService: ToastrService) { }
  ngOnInit(): void {
    this.licenseForm = this.fb.group({
      LicenseKey: [null, Validators.required],
    })
    this.loadStatus();
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

    this.loadProductDetails(this.licenseForm.value.LicenseKey);
  }

  loadProductDetails(key: string) {
    this.Loading = true;
    this.licenseService.GetProductDetailsByLicense(key).subscribe({
      next: (response) => {

        this.Loading = false;
        this.ProductDetails = response;
        this.displayDialog = true;
        console.info(response);
        // this.toastService.success("Product details loaded successfully")
      },
      error: (error) => {

        this.Loading = false;
        if (error.status === 404) {
          this.toastService.error("License or Product details not found.");
        } else {
          this.toastService.error("Unable to load product details.");
        }

        console.error(error);
      }
    });
  }
  registerProduct() {
    this.ProductDetailsLoading = true;
    this.licenseService.RegisterProduct(this.ProductDetails).subscribe({
      next: (response) => {
        this.ProductDetailsLoading = false;
        this.toastService.success("Registered successfully");
      },
      error: (error) => {
        this.ProductDetailsLoading = false;
        this.toastService.error("Unable to register.")
        console.error(error);
      }
    })
  }

  loadStatus() {
    this.licenseService.GetLicenseStatus().subscribe({
      next: (isActive) => {
        if (isActive) {
          this.isExpired = isActive;
          this.licenseForm.patchValue({ LicenseKey: 'License still valid' });
          this.licenseForm.get('LicenseKey')?.disable();
        }
        else {
          this.isExpired = isActive;
        }
      },
      error: (error) => {
        this.toastService.error("Unable to load license status.");
      }
    })
  }
}
