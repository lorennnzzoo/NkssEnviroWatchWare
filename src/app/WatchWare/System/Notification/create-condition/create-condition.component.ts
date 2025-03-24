import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Condition, ConditionType, Operator } from '../../../Interfaces/NotificationCondition';
import { CommonModule, Location } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../../Services/notification.service';

@Component({
  selector: 'app-create-condition',
  imports: [ReactiveFormsModule, CommonModule, ToastrModule],
  templateUrl: './create-condition.component.html',
  styleUrl: './create-condition.component.css',
  providers: [ToastrService]
})
export class CreateConditionComponent implements OnInit {
  conditionForm!: FormGroup;
  Loading: boolean = false;
  // conditionTypes = Object.values(ConditionType);
  // operators = Object.values(Operator);

  conditionTypes = [
    { label: 'Value', value: ConditionType.Value },
    { label: 'LogTime', value: ConditionType.LogTime }
  ];

  operators = [
    { label: 'GreaterThan', value: Operator.GreaterThan },
    { label: 'LessThan', value: Operator.LessThan },
    { label: 'GreaterThanOrEqual', value: Operator.GreaterThanOrEqual },
    { label: 'LessThanOrEqual', value: Operator.LessThanOrEqual },
    { label: 'Equal', value: Operator.Equal },
  ];


  constructor(private fb: FormBuilder, private location: Location, private toastService: ToastrService, private notificaitonService: NotificationService) {

  }
  ngOnInit(): void {
    this.conditionForm = this.fb.group({
      ConditionName: ['', Validators.required],
      ConditionType: [ConditionType.Value, Validators.required],
      Operator: [Operator.GreaterThan, Validators.required],
      Threshold: [null, [Validators.required, Validators.min(0)]],
      Duration: [null, [Validators.required, Validators.min(1)]],
      Cooldown: [null, [Validators.required, Validators.min(1)]],
    });
  }

  goBack() {
    this.location.back();
  }
  onSubmit() {
    this.Loading = true;
    if (this.conditionForm.invalid) {

      this.toastService.warning('Please fill all required fields', 'Warning');
      this.Loading = false;
      return;
    }
    const condition: Condition = {
      ConditionName: this.conditionForm.value.ConditionName,
      ConditionType: this.conditionForm.value.ConditionType,
      Cooldown: this.conditionForm.value.Cooldown,
      Duration: this.conditionForm.value.Duration,
      Operator: this.conditionForm.value.Operator,
      Threshold: this.conditionForm.value.Threshold,
    };
    this.notificaitonService.CreateCondition(condition).subscribe({
      next: (repsonse) => {
        this.Loading = false;
        this.toastService.success('Condition created successfully');
      },
      error: (error) => {
        this.Loading = false;
        this.toastService.error("Unable to create condition");
        console.log(error);
      }
    })
  }
}
