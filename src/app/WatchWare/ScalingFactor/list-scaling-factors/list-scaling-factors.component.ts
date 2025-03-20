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
import { ScalingFactorService } from '../../Services/scaling-factor.service';
import { ScalingFactor } from '../../Interfaces/ScalingFactor';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-list-scaling-factors',
  imports: [TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, ToastrModule, ConfirmDialogModule],
  templateUrl: './list-scaling-factors.component.html',
  styleUrl: './list-scaling-factors.component.css',
  providers: [ToastrService, ConfirmationService]
})
export class ListScalingFactorsComponent implements OnInit {

  ScalingFactors: ScalingFactor[] = [];
  Loading: boolean = false;
  constructor(
    private toastService: ToastrService,
    private dialogService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router,
    private scalingFactorService: ScalingFactorService
  ) { }
  ngOnInit(): void {
    this.loadScalingFactors();
  }
  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  loadScalingFactors() {
    this.Loading = true;
    this.scalingFactorService.GetAllScalingFactors().subscribe(
      {
        next: (data) => {
          this.ScalingFactors = data;
          this.Loading = false;
        },
        error: (error) => {
          this.toastService.error('Unable To Load Scaling Factors', 'Error');
          console.error('Error loading scaling factors:', error);
          this.Loading = false;
        }
      }
    )
  }
  onCreate() {
    this.router.navigate(['/ScalingFactor/Add'])
  }
  onEdit(scalingFactor: ScalingFactor) {
    this.router.navigate(['/ScalingFactor/Edit', scalingFactor.Id])
  }
  onDelete(scalingFactor: ScalingFactor) {
    this.dialogService.confirm({
      message: 'Are you sure you want to delete this scaling factor?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // User clicked "Yes"
        this.scalingFactorService.DeleteScalingFactor(scalingFactor).subscribe
          ({
            next: (response) => {
              this.toastService.success('Scaling Factor deleted successfully', 'Deleted');
              this.ngOnInit();
            },
            error: (error) => {
              this.toastService.error(error.error, 'Unable To Delete Scaling Factor');
            }
          })
      },
      reject: () => {
        // User clicked "No"

      },
    });
  }
}
