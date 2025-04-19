import { Component, OnInit } from '@angular/core';
import { Template } from '../../../Interfaces/DisplayBoard';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { DisplayBoardService } from '../../../Services/display-board.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-display-board-templates',
  imports: [ToastrModule, TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, ConfirmDialogModule],
  templateUrl: './display-board-templates.component.html',
  styleUrl: './display-board-templates.component.css',
  providers: [ToastrService, ConfirmationService]
})
export class DisplayBoardTemplatesComponent implements OnInit {


  Templates: Template[] = [];
  Loading: boolean = false;
  constructor(private router: Router, private toastService: ToastrService, private dialogService: ConfirmationService, private displayBoardService: DisplayBoardService) { }
  ngOnInit(): void {
    this.loadTemplates();
  }
  loadTemplates() {
    this.Loading = true;
    this.displayBoardService.GetAllTemplates().subscribe({
      next: (response) => {
        this.Templates = response;
        this.Loading = false;
      },
      error: (error) => {
        this.Loading = false;
        console.error(error);
        this.toastService.error("Unable to load templates");
      }
    })
  }
  onCreate() {
    this.router.navigate(['/System/Configuration/DisplayBoard/CreateTemplate']);
  }
  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  onDelete(template: Template) {
    this.dialogService.confirm({
      message: 'Are you sure you want to delete this template?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // User clicked "Yes"
        this.displayBoardService.DeleteTemplate(template.Id).subscribe
          ({
            next: (response) => {
              this.toastService.success('Template deleted successfully', 'Deleted');
              this.ngOnInit();
            },
            error: (error) => {
              this.toastService.error(error.error, 'Unable To Delete Template');
            }
          })
      },
      reject: () => {
        // User clicked "No"

      },
    });
  }

  onEdit(template: Template) {
    this.router.navigate(['/System/Configuration/DisplayBoard/EditTemplate', template.Id])
  }
}
