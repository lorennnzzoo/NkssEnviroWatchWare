import { Component, OnInit } from '@angular/core';
import { Contact, ContactCreation, ContactDeletion, ContactEdition, ContactType } from '../../../Interfaces/Contact';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../../Services/notification.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  imports: [ToastrModule, TableModule, TagModule, ReactiveFormsModule, FormsModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, ConfirmDialogModule, DialogModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
  providers: [ToastrService, ConfirmationService]
})
export class ContactsComponent implements OnInit {

  contactForm!: FormGroup;
  ContactType = ContactType;
  MobileContacts: Contact[] = [];
  MobilesLoading: boolean = false;
  MobileFormShow: boolean = false;
  EmailContacts: Contact[] = [];
  EmailsLoading: boolean = false;
  EmailFormShow: boolean = false;
  SaveLoading: boolean = false;

  constructor(private notificationService: NotificationService, private fb: FormBuilder, private toastService: ToastrService, private dialogueService: ConfirmationService) {
    this.contactForm = this.fb.group({
      type: [null, Validators.required],
      address: ['']
    });
    this.contactForm.get('type')?.valueChanges.subscribe((type: ContactType) => {
      const addressControl = this.contactForm.get('address');
      if (!addressControl) return;

      // Clear previous validators
      addressControl.clearValidators();

      if (type === ContactType.Email) {
        addressControl.setValidators([Validators.required, Validators.email]);
      } else if (type === ContactType.Mobile) {
        addressControl.setValidators([
          Validators.required,
          Validators.pattern(/^\d{10}$/),
          Validators.maxLength(10)
        ]);
      }

      addressControl.updateValueAndValidity();
    });

  }

  ngOnInit(): void {
    this.loadEmails();
    this.loadMobiles();
  }
  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  loadEmails() {
    this.EmailsLoading = true;
    this.notificationService.GetContacts(ContactType.Email).subscribe({
      next: (resposne) => {
        this.EmailContacts = resposne;
        this.EmailsLoading = false;
      },
      error: (error) => {
        this.EmailsLoading = false;
        console.error(error);
        this.toastService.error("Unable to fetch email addresses");
      }
    })
  }

  loadMobiles() {
    this.MobilesLoading = true;
    this.notificationService.GetContacts(ContactType.Mobile).subscribe({
      next: (resposne) => {
        this.MobileContacts = resposne;
        this.MobilesLoading = false;
      },
      error: (error) => {
        this.MobilesLoading = false;
        console.error(error);
        this.toastService.error("Unable to fetch mobile addresses");
      }
    })
  }

  onDelete(type: ContactType, id: string) {
    this.dialogueService.confirm({
      message: 'Are you sure you want to delete this contact?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        const deletion: ContactDeletion = {
          id: id,
          type: type
        }
        // User clicked "Yes"
        this.notificationService.DeleteContact(deletion).subscribe
          ({
            next: (response) => {
              this.toastService.success('Contact deleted successfully', 'Deleted');
              if (type == ContactType.Email) {
                this.loadEmails();
              }
              else {
                this.loadMobiles();
              }
            },
            error: (error) => {
              this.toastService.error(error.error, 'Error');
            }
          })
      },
      reject: () => {
        // User clicked "No"

      },
    });
  }

  onCreate(type: ContactType) {
    this.contactForm.reset();
    this.contactForm.patchValue({ type: type });
    if (type === ContactType.Email) {
      this.EmailFormShow = true;
      this.MobileFormShow = false;
    } else {
      this.MobileFormShow = true;
      this.EmailFormShow = false;
    }
  }


  onSaveContact(type: ContactType) {
    this.SaveLoading = true;
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.SaveLoading = false;
      return;
    }

    const creation: ContactCreation = {
      type: this.contactForm.value.type,
      address: this.contactForm.value.address
    }

    this.notificationService.CreateContact(creation).subscribe({
      next: (response) => {
        this.SaveLoading = false;
        this.toastService.success("Contact successfully added");

        this.EmailFormShow = false;
        this.MobileFormShow = false;

        if (type == ContactType.Email) {
          this.loadEmails();
        }
        else {
          this.loadMobiles();
        }
      },
      error: (error) => {
        this.SaveLoading = false;
        console.error(error)
        this.toastService.error(error.error);
      }
    })
  }


  EditingId: string | null = null;
  EditEmailFormShow: boolean = false;
  EditMobileFormShow: boolean = false;
  UpdateLoading: boolean = false;


  onEditContact(type: ContactType, id: string, address: string) {
    this.EditingId = id;
    this.contactForm.reset();
    this.contactForm.patchValue({ type: type, address: address });
    if (type === ContactType.Email) {
      this.EditEmailFormShow = true;
      this.EditMobileFormShow = false;
    } else {
      this.EditMobileFormShow = true;
      this.EditEmailFormShow = false;
    }
  }

  onUpdateContact(type: ContactType) {
    this.UpdateLoading = true;
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.UpdateLoading = false;
      return;
    }
    if (this.EditingId === null) {
      this.toastService.warning("please select contact to edit.");
    }

    const edition: ContactEdition = {
      id: this.EditingId,
      type: this.contactForm.value.type,
      address: this.contactForm.value.address
    }


    this.notificationService.EditContact(edition).subscribe({
      next: (response) => {
        this.UpdateLoading = false;
        this.toastService.success("Contact successfully updated");

        this.EditEmailFormShow = false;
        this.EditMobileFormShow = false;

        if (type == ContactType.Email) {
          this.loadEmails();
        }
        else {
          this.loadMobiles();
        }
      },
      error: (error) => {
        this.UpdateLoading = false;
        console.error(error)
        this.toastService.error(error.error);
      }
    })
  }
}
