import { Component, OnInit } from '@angular/core';
import { Channel } from '../../Interfaces/Channel';
import { ChannelService } from '../../Services/channel.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Template } from '../../Interfaces/DisplayBoard';
import { DisplayBoardService } from '../../Services/display-board.service';

@Component({
  selector: 'app-display-board',
  imports: [ToastrModule, CommonModule, ReactiveFormsModule],
  templateUrl: './display-board.component.html',
  styleUrl: './display-board.component.css',
  providers: [ToastrService]
})
export class DisplayBoardComponent implements OnInit {

  displayForm!: FormGroup;
  Channels: Channel[] = [];
  Loading: boolean = false;
  ChannelsLoading: boolean = false;

  constructor(private fb: FormBuilder, private channelService: ChannelService, private displayBoardService: DisplayBoardService, private toastService: ToastrService) { }
  ngOnInit(): void {
    this.displayForm = this.fb.group({
      FileName: [null, Validators.required],
      FilePath: [null, Validators.required],
      FileType: [null, Validators.required],
      Template: [null, Validators.required],
    });
    this.loadChannels();
  }
  loadChannels() {
    this.ChannelsLoading = true;
    this.channelService.GetAllChannels().subscribe({
      next: (data) => {
        this.Channels = data;
        this.ChannelsLoading = false;
      },
      error: (error) => {
        this.toastService.error(error.error, 'Error');
        console.log(error);
        this.ChannelsLoading = false;
      }
    })
  }
  getIndexArray(total: number, size: number): number[] {
    return Array.from({ length: Math.ceil(total / size) }, (_, i) => i * size);
  }
  onSubmit() {
    this.Loading = true;

    // Check if the form is invalid
    if (this.displayForm.invalid) {

      this.toastService.warning('Please fill all required fields', 'Warning');
      this.Loading = false;
      return;
    }

    const template: Template = {
      FileName: this.displayForm.value.FileName,
      FilePath: this.displayForm.value.FilePath,
      FileType: this.displayForm.value.FileType,
      TemplateContent: this.displayForm.value.Template
    };
    console.log(template);
    this.displayBoardService.CreateDisplayBoardTemplate(template).subscribe({
      next: (response) => {
        this.toastService.success('Template created successfully', 'Created')
        this.Loading = false;
        this.ngOnInit();
      },
      error: (error) => {
        this.toastService.error(error.error, 'Error')
        this.Loading = false;
      }
    })
  }
  onPreview() {

  }
}
