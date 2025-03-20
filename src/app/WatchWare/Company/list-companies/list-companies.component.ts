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
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { throwIfEmpty } from 'rxjs';

@Component({
  selector: 'app-list-companies',
  imports: [TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule],
  templateUrl: './list-companies.component.html',
  styleUrl: './list-companies.component.css'
})
export class ListCompaniesComponent implements OnInit {

  constructor(private router: Router, private companyService: CompanyService, private toastService: ToastrService) { }

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
}
