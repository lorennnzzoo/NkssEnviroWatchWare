import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CompanyService } from '../../Services/company.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { CompanyEdit } from '../../Interfaces/Company';

@Component({
  selector: 'app-edit-company',
  imports: [CommonModule, ReactiveFormsModule, ToastrModule],
  templateUrl: './edit-company.component.html',
  styleUrl: './edit-company.component.css',
  providers: [ToastrService]
})
export class EditCompanyComponent implements OnInit {
  companyForm!: FormGroup; // Reactive form for company creation
  Loading: boolean = false;
  companyId!: number;


  constructor(
    private fb: FormBuilder,
    private toastService: ToastrService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.companyId = +id; // Convert string to number
        this.loadCompanyData(this.companyId);
      }
    });
    // Initialize the form with validators
    this.companyForm = this.fb.group({
      id: ['', Validators.required],
      shortName: ['', Validators.required],
      legalName: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      address: ['', Validators.required],
      pinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]], // 6-digit pin code validation
    });


  }

  loadCompanyData(id: number): void {
    this.companyService.GetCompanyById(id).subscribe({
      next: (company) => {
        this.companyForm.patchValue({
          id: company.Id,
          shortName: company.ShortName,
          legalName: company.LegalName,
          country: company.Country,
          state: company.State,
          district: company.District,
          address: company.Address,
          pinCode: company.PinCode,
        });
      },
      error: () => {
        this.toastService.error('Unable to load company details', 'Error');
        this.location.back();
      },
    });
  }

  // Handle form submission
  onSubmit(): void {
    this.Loading = true;

    // Check if the form is invalid
    if (this.companyForm.invalid) {

      this.toastService.warning('Please fill all required fields', 'Warning');
      this.Loading = false;
      return;
    }

    // Create a Company object from the form values
    const company: CompanyEdit = {
      Id: this.companyForm.value.id,
      ShortName: this.companyForm.value.shortName,
      LegalName: this.companyForm.value.legalName,
      Country: this.companyForm.value.country, // Assuming country is a string, not an object
      State: this.companyForm.value.state,
      District: this.companyForm.value.district,
      Address: this.companyForm.value.address,
      PinCode: this.companyForm.value.pinCode,
    };

    // Call the API to create the company
    this.companyService.EditCompany(company).subscribe({
      next: (response) => {
        // Handle successful response

        this.toastService.success('Company updated successfully', 'Updated');
        this.Loading = false; // Reset the form
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
