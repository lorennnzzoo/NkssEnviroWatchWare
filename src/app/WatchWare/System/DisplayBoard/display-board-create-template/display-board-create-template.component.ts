import { Component, OnInit } from '@angular/core';
import { Channel } from '../../../Interfaces/Channel';
import { ChannelService } from '../../../Services/channel.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Template, TemplateCreate } from '../../../Interfaces/DisplayBoard';
import { DisplayBoardService } from '../../../Services/display-board.service';
import { Location } from '@angular/common';
import { Station } from '../../../Interfaces/Station';
import { StationService } from '../../../Services/station.service';

@Component({
  selector: 'app-display-board',
  imports: [ToastrModule, CommonModule, ReactiveFormsModule],
  templateUrl: './display-board-create-template.component.html',
  styleUrl: './display-board-create-template.component.css',
  providers: [ToastrService]
})
export class DisplayBoardCreateTemplateComponent implements OnInit {
  existingFileName: string | null = null;
  displayForm!: FormGroup;
  Stations: Station[] = [];
  Channels: Channel[] = [];
  Loading: boolean = false;
  ChannelsLoading: boolean = false;
  StationsLoading: boolean = false;
  StationChannels: { [stationId: number]: Channel[] } = {};


  constructor(private fb: FormBuilder, private channelService: ChannelService, private stationService: StationService, private location: Location, private displayBoardService: DisplayBoardService, private toastService: ToastrService) { }
  ngOnInit(): void {
    this.displayForm = this.fb.group({
      FileName: [null, Validators.required],
      FilePath: [null, Validators.required],
      FileType: [null, Validators.required],
      Template: [null, Validators.required],
    });
    this.loadAllChannelsGroupedByStation();
  }
  loadAllChannelsGroupedByStation() {
    this.StationsLoading = true;
    this.stationService.GetAllStations().subscribe({
      next: (stations) => {
        this.Stations = stations;
        this.StationsLoading = false;

        // Load channels per station
        stations.forEach((station) => {
          this.channelService.GetAllChannelsByStation(station.Id).subscribe({
            next: (channels) => {
              this.StationChannels[station.Id] = channels;
            },
            error: (error) => {
              this.toastService.error(error.error, 'Error loading channels');
            }
          });
        });
      },
      error: (error) => {
        this.toastService.error(error.error, 'Error loading stations');
        this.StationsLoading = false;
      }
    });
  }


  getIndexArray(total: number, size: number): number[] {
    return Array.from({ length: Math.ceil(total / size) }, (_, i) => i * size);
  }
  onSubmit() {
    this.Loading = true;

    // Check if the form is invalid
    if (this.displayForm.invalid) {
      this.displayForm.get('Template')?.markAsTouched();
      this.displayForm.get('FilePath')?.markAsTouched();
      this.displayForm.get('FileName')?.markAsTouched();
      this.displayForm.get('FileType')?.markAsTouched();

      this.toastService.warning('Please fill all required fields', 'Warning');
      this.Loading = false;
      return;
    }

    const template: TemplateCreate = {
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
        this.location.back();
      },
      error: (error) => {
        this.toastService.error(error.error, 'Error')
        this.Loading = false;
      }
    })
  }
  onFileTypeChange(event: Event): void {
    const selectedFileType = (event.target as HTMLSelectElement).value;

    // If user switches to a new file type, clear the template content
    if (selectedFileType) {
      this.displayForm.patchValue({
        Template: null  // Clear the template content
      });

      // Optionally, reset other fields (like existingFileName) if needed
      this.existingFileName = null;
    }
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


}
