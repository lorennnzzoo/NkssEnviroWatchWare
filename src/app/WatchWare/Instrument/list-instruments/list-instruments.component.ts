import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ProtocolService } from '../../Services/protocol.service';
import { Analyzer } from '../../Interfaces/Protocol';
@Component({
  selector: 'app-list-instruments',
  imports: [TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule],
  templateUrl: './list-instruments.component.html',
  styleUrl: './list-instruments.component.css'
})
export class ListInstrumentsComponent implements OnInit {

  Protocols: Analyzer[] = [];
  Loading: boolean = false;
  constructor(
    private toastService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private protocolService: ProtocolService
  ) { }
  ngOnInit(): void {
    this.loadProtocols();
  }
  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  loadProtocols() {
    this.Loading = true;
    this.protocolService.GetAllProtocols().subscribe(
      {
        next: (data) => {
          this.Protocols = data;
          this.Loading = false;
        },
        error: (error) => {
          this.toastService.error('Unable To Load Analyzers', 'Error');
          console.error('Error loading analyzers:', error);
          this.Loading = false;
        }
      }
    )
  }
  onCreate() {
    this.router.navigate(['/Instrument/Add'])
  }
  onEdit(instrument: Analyzer) {
    this.router.navigate(['/Instrument/Edit', instrument.Id])
  }
}
