import { Component, OnInit } from '@angular/core';
import { DataAggregationType, ReportFilter, ReportType } from '../../Interfaces/ReportSubmitFilter';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReportService } from '../../Services/report.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SelectionModel } from '../../Interfaces/ReportSelection';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-selection',
  imports: [ToastrModule, ReactiveFormsModule, CommonModule, NgMultiSelectDropDownModule],
  templateUrl: './selection.component.html',
  styleUrl: './selection.component.css',
  providers: [ToastrService]
})
export class SelectionComponent {

}
