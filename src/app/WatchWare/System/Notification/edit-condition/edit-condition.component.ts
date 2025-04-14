import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Condition, ConditionType, Operator } from '../../../Interfaces/NotificationCondition';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../../Services/notification.service';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-condition',
  imports: [CommonModule, ToastrModule, ReactiveFormsModule],
  templateUrl: './edit-condition.component.html',
  styleUrl: './edit-condition.component.css',
  providers: [ToastrService]
})
export class EditConditionComponent implements OnInit {
  conditionId!: string;
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


  constructor(private fb: FormBuilder, private location: Location, private route: ActivatedRoute, private toastService: ToastrService, private notificaitonService: NotificationService) {

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.conditionId = id;
        this.loadConditionData(this.conditionId);
      }
    });
    this.conditionForm = this.fb.group({
      Id: [null, Validators.required],
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
      Id: this.conditionForm.value.Id,
      ConditionName: this.conditionForm.value.ConditionName,
      ConditionType: this.conditionForm.value.ConditionType,
      Cooldown: this.conditionForm.value.Cooldown,
      Duration: this.conditionForm.value.Duration,
      Operator: this.conditionForm.value.Operator,
      Threshold: this.conditionForm.value.Threshold,
    };
    this.notificaitonService.UpdateCondition(condition).subscribe({
      next: (repsonse) => {
        this.Loading = false;
        this.toastService.success('Condition updated successfully');
        this.goBack();
      },
      error: (error) => {
        this.Loading = false;
        this.toastService.error("Unable to update condition");
        console.log(error);
      }
    })
  }
  loadConditionData(id: string) {
    this.notificaitonService.GetConditionById(id).subscribe({
      next: (condition) => {
        this.conditionForm.patchValue({
          Id: condition.Id,
          ConditionName: condition.ConditionName,
          ConditionType: condition.ConditionType,
          Cooldown: condition.Cooldown,
          Duration: condition.Duration,
          Operator: condition.Operator,
          Threshold: condition.Threshold
        });
      },
      error: (error) => {
        console.error(error);
        this.toastService.error("Unable to load condition");
      }
    })
  }
}
