import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Channel } from '../../../Interfaces/Channel';
import { DisplayBoardService } from '../../../Services/display-board.service';
import { ToastrService } from 'ngx-toastr';
import { ChannelService } from '../../../Services/channel.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Template } from '../../../Interfaces/DisplayBoard';

@Component({
  selector: 'app-display-board-edit-template',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './display-board-edit-template.component.html',
  styleUrl: './display-board-edit-template.component.css',
  providers: [ToastrService]
})
export class DisplayBoardEditTemplateComponent implements OnInit {
  templateId!: string;
  existingFileName: string | null = null;

  displayForm!: FormGroup;
  Channels: Channel[] = [];
  Loading: boolean = false;
  ChannelsLoading: boolean = false;
  constructor(private fb: FormBuilder, private channelService: ChannelService, private route: ActivatedRoute, private location: Location, private displayBoardService: DisplayBoardService, private toastService: ToastrService) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.templateId = id;
        this.loadTemplate(this.templateId);
      }
    });
    this.displayForm = this.fb.group({
      Id: [null, Validators.required],
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
  loadTemplate(id: string) {
    this.displayBoardService.GetTemplateById(id).subscribe({
      next: (template) => {
        if (template.TemplateContent) {
          this.existingFileName = `${template.FileName}.${template.FileType}`;
        }
        this.displayForm.patchValue({
          Id: template.Id,
          FileName: template.FileName,
          FilePath: template.FilePath,
          FileType: template.FileType,
          Template: template.TemplateContent,
        })
      },
      error: (error) => {
        this.toastService.error("unable to load template")
      }
    })
  }
  getIndexArray(total: number, size: number): number[] {
    return Array.from({ length: Math.ceil(total / size) }, (_, i) => i * size);
  }

  // onExcelFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (!input.files?.length) return;

  //   const file = input.files[0];
  //   const fileExtension = file.name.split('.').pop(); // Get "xls", "xlsx", etc.

  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     const binaryData = reader.result as string;

  //     // Convert binary to base64
  //     const base64Data = btoa(binaryData);

  //     // Patch both base64 data and extension into the form
  //     this.displayForm.patchValue({
  //       Template: base64Data,
  //       FileType: fileExtension
  //     });

  //     console.log('Base64 Excel file and extension loaded into form controls.');
  //   };

  //   reader.readAsBinaryString(file); // Reads the file as binary string

  // }
  onExcelFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const fileExtension = file.name.split('.').pop();

    const reader = new FileReader();
    reader.onload = () => {
      const binaryData = reader.result as string;
      const base64Data = btoa(binaryData);

      this.displayForm.patchValue({
        Template: base64Data,
        FileType: fileExtension
      });

      this.existingFileName = file.name;
    };

    reader.readAsBinaryString(file);
  }
  removeExistingFile(): void {
    this.displayForm.patchValue({
      Template: null,
    });
    this.existingFileName = null;
  }
  getDownloadLink(): string {
    const base64 = this.displayForm.value.Template;
    const fileType = this.displayForm.value.FileType;
    const mimeType = this.getMimeType(fileType);
    return `data:${mimeType};base64,${base64}`;
  }

  getMimeType(extension: string): string {
    switch (extension.toLowerCase()) {
      case 'xls': return 'application/vnd.ms-excel';
      case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      default: return 'application/octet-stream';
    }
  }

  onSubmit() {
    this.Loading = true;
    if (!this.displayForm.valid) {
      this.displayForm.markAllAsTouched();
      this.toastService.warning('Please fill all required fields', 'Warning');
      this.Loading = false;
      return;
    }

    const template: Template = {
      Id: this.displayForm.value.Id,
      FileName: this.displayForm.value.FileName,
      FilePath: this.displayForm.value.FilePath,
      FileType: this.displayForm.value.FileType,
      TemplateContent: this.displayForm.value.Template
    }

    this.displayBoardService.UpdateTemplate(template).subscribe({
      next: (response) => {
        this.toastService.success('Updated successfully.');
        this.Loading = false;
        this.location.back();
      },
      error: (error) => {
        this.Loading = false;
        console.error(error);
        this.toastService.error("Unable to update");
      }
    })

  }
}
