import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../Services/Settings/configuration.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { ConfigSetting } from '../../Interfaces/ConfigSetting';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-configuration',
  imports: [TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, ToastrModule, ConfirmDialogModule, CommonModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css',
  providers: [ToastrService, ConfirmationService]
})
export class ConfigurationComponent implements OnInit {

  ConfigSettings: ConfigSetting[] = [];
  Loading: boolean = false;
  constructor(
    private configuratioService: ConfigurationService,
    private toastService: ToastrService,
    private confirmationService: ConfirmationService,
    private router: Router,
  ) { }
  ngOnInit(): void {
    this.loadConfigurationSettings();
  }

  loadConfigurationSettings() {
    this.Loading = true;
    this.configuratioService.GetAllConfigSettings().subscribe({
      next: (data) => {
        this.ConfigSettings = data;
        this.Loading = false;
      },
      error: (error) => {
        this.toastService.error('Unable to load configuration settings');
        console.error('Error loading companies:', error);
        this.Loading = false;
      }
    })
  }
  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  onEdit(ConfigSetting: ConfigSetting) {
    this.router.navigate(['/Configurations/Edit', ConfigSetting.Id])
  }
  onDelete(ConfigSetting: ConfigSetting) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this setting?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // User clicked "Yes"
        this.configuratioService.DeleteConfigSetting(ConfigSetting).subscribe
          ({
            next: (response) => {
              this.toastService.success('Configuration deleted successfully', 'Deleted');
              this.ngOnInit();
            },
            error: (error) => {
              this.toastService.error('Unable To Delete Configuration', 'Error');
            }
          })
      },
      reject: () => {
        // User clicked "No"
      },
    });
  }
  onCreate() {
    this.router.navigate(['/Configurations/Add'])
  }
}
