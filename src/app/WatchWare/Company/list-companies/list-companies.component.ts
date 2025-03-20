import { Component, OnInit } from '@angular/core';
import { Company } from '../../Interfaces/Company';
import { CompanyService } from '../../Services/company.service';
import { ToastrService } from 'ngx-toastr';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-list-companies',
  imports: [TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, ConfirmDialogModule],
  templateUrl: './list-companies.component.html',
  styleUrl: './list-companies.component.css',
  providers: [ToastrService, ConfirmationService]
})
export class ListCompaniesComponent implements OnInit {

  constructor(private router: Router, private companyService: CompanyService, private toastService: ToastrService, private dialogService: ConfirmationService) { }

  ngOnInit(): void {
    this.loadCompanies();
  }
  Companies: Company[] = [];

  Loading: boolean = false;

  loadCompanies() {
    this.Loading = true;
    this.companyService.GetAllCompanies().subscribe(
      (data) => {
        console.log(data)
        this.Companies = data;
        this.Loading = false;
      },
      (error) => {
        this.toastService.error('Unable to load companies', 'Error occured');
        console.error('Error loading companies:', error);
        this.Loading = false;
      }
    );
  }
  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  onStations(company: Company) {
    this.router.navigate(['Stations', company.Id])
  }
  onCreate() {
    this.router.navigate(['/Company/Add'])
  }
  onEdit(company: Company) {
    this.router.navigate(['/Company/Edit', company.Id])
  }
  onDelete(company: Company) {
    this.dialogService.confirm({
      message: 'Are you sure you want to delete this company?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // User clicked "Yes"
        this.companyService.DeleteCompany(company).subscribe
          ({
            next: (response) => {

              this.toastService.success('Company deleted successfully', 'Deleted');
              this.ngOnInit();
            },
            error: (error) => {
              this.toastService.error('Unable To Delete Company', 'Error');
              console.log(error);
            }
          })
      },
      reject: () => {
        // User clicked "No"

      },
    });
  }
}
