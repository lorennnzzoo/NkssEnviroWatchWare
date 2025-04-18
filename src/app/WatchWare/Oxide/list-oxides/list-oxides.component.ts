import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { OxideService } from '../../Services/oxide.service';
import { Oxide } from '../../Interfaces/Oxide';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-list-oxides',
  imports: [TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, ConfirmDialogModule, ToastrModule],
  templateUrl: './list-oxides.component.html',
  styleUrl: './list-oxides.component.css',
  providers: [ToastrService, ConfirmationService]
})
export class ListOxidesComponent implements OnInit {

  Oxides: Oxide[] = [];
  Loading: boolean = false;
  constructor(
    private toastService: ToastrService,
    private dialogService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router,
    private oxideService: OxideService
  ) { }
  ngOnInit(): void {
    this.loadOxides();
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  loadOxides() {
    this.Loading = true;
    this.oxideService.GetAllOxides().subscribe(
      {
        next: (data) => {
          this.Oxides = data;
          this.Loading = false;
        },
        error: (error) => {
          this.toastService.error('Unable To Load Oxides', 'Error');
          console.error('Error loading oxides:', error);
          this.Loading = false;
        }
      }
    )
  }
  onCreate() {
    this.router.navigate(['/Oxide/Add'])
  }
  onEdit(oxide: Oxide) {
    this.router.navigate(['/Oxide/Edit', oxide.Id])
  }
  onDelete(oxide: Oxide) {
    this.dialogService.confirm({
      message: 'Are you sure you want to delete this oxide?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // User clicked "Yes"
        this.oxideService.DeleteOxide(oxide).subscribe
          ({
            next: (response) => {
              this.toastService.success('Oxide deleted successfully', 'Deleted');
              this.ngOnInit();
            },
            error: (error) => {
              this.toastService.error(error.error, 'Unable To Delete Oxide');
            }
          })
      },
      reject: () => {
        // User clicked "No"

      },
    });
  }
}
