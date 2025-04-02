import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePickerModule } from 'primeng/datepicker';
import { LicenseService } from '../../Services/license.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ProductDetails, Registration, User } from '../../Interfaces/ProductRegister';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { AddUserComponent } from "../../UsersManagement/add-user/add-user.component";

@Component({
  selector: 'app-license',
  imports: [CommonModule, ReactiveFormsModule, DatePickerModule, ToastrModule, DialogModule],
  templateUrl: './license.component.html',
  styleUrl: './license.component.css',
  providers: [ToastrService, ConfirmationService]
})
export class LicenseComponent implements OnInit {
  Loading: boolean = false;
  displayDialog: boolean = false;
  showPassword: boolean = false;
  isNotExpired: boolean = false;
  ShowUserDetails: boolean = false;
  StatusLoading: boolean = false;
  licenseForm!: FormGroup;
  ProductDetailsLoading: boolean = false;
  ProductDetails!: ProductDetails;
  constructor(private router: Router, private fb: FormBuilder, private licenseService: LicenseService, private toastService: ToastrService) { }
  ngOnInit(): void {
    this.licenseForm = this.fb.group({
      LicenseKey: [null, Validators.required],
      Password: [null, Validators.required],
      Email: [null, [Validators.required, Validators.email]],
      PhoneNumber: [null, [Validators.required, Validators.pattern(/^\d{10}$/), Validators.maxLength(10)]],
    })
    this.loadStatus();
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
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

    const user: User = {
      Password: this.licenseForm.value.Password,
      Email: this.licenseForm.value.Email,
      PhoneNumber: this.licenseForm.value.PhoneNumber
    }
    this.ProductDetails.UserDetails = user;
    this.licenseService.RegisterProduct(this.ProductDetails).subscribe({
      next: (response) => {
        this.ProductDetailsLoading = false;
        this.displayDialog = false;
        this.ShowUserDetails = true;
        this.toastService.success("Registered successfully");
      },
      error: (error) => {
        this.ProductDetailsLoading = false;
        this.toastService.error(error.error)
        console.error(error);
      }
    })
  }

  loadStatus() {
    this.StatusLoading = true;
    this.licenseService.GetLicenseStatus().subscribe({
      next: (isActive) => {
        this.StatusLoading = false;
        if (isActive) {
          this.isNotExpired = isActive;
        }
        else {
          this.isNotExpired = isActive;
        }
      },
      error: (error) => {
        this.StatusLoading = false;
        this.toastService.error("Unable to load license status.");
        console.error(error);
      }
    })
  }
}
