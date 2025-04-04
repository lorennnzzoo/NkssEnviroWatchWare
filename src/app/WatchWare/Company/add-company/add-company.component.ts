import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CompanyService } from '../../Services/company.service';
import { CommonModule, Location } from '@angular/common';
import { CompanyCreation } from '../../Interfaces/Company';
@Component({
  selector: 'app-add-company',
  imports: [ToastrModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.css',
  providers: [ToastrService]
})
export class AddCompanyComponent implements OnInit {

  companyForm!: FormGroup; // Reactive form for company creation
  Loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toastService: ToastrService,
    private companyService: CompanyService,
    private location: Location
  ) { }

  ngOnInit(): void {
    // Initialize the form with validators
    this.companyForm = this.fb.group({
      shortName: ['', Validators.required],
      legalName: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      address: ['', Validators.required],
      pinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]], // 6-digit pin code validation
    });
  }
  onSubmit(): void {
    this.Loading = true;

    // Check if the form is invalid
    if (this.companyForm.invalid) {

      this.toastService.warning('Please fill all required fields', 'Warning')
      this.Loading = false;
      return;
    }

    // Create a Company object from the form values
    const company: CompanyCreation = {
      ShortName: this.companyForm.value.shortName,
      LegalName: this.companyForm.value.legalName,
      Country: this.companyForm.value.country, // Assuming country is a string, not an object
      State: this.companyForm.value.state,
      District: this.companyForm.value.district,
      Address: this.companyForm.value.address,
      PinCode: this.companyForm.value.pinCode,
    };

    // Call the API to create the company
    this.companyService.CreateCompany(company).subscribe({
      next: (response) => {
        // Handle successful response        
        this.toastService.success('Company created successfully', 'Created')
        this.Loading = false;
        this.goBack();
      },
      error: (error) => {
        // Handle error response

        this.toastService.error(error.error, 'Error')
        this.Loading = false;
      },
    });
  }
  goBack() {
    this.location.back();
  }
}
