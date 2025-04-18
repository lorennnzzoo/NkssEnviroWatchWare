import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../../Services/channel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OxideService } from '../../Services/oxide.service';
import { ChannelTypeService } from '../../Services/channel-type.service';
import { ProtocolService } from '../../Services/protocol.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Channel, ChannelListView } from '../../Interfaces/Channel';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Station } from '../../Interfaces/Station';
import { StationService } from '../../Services/station.service';
@Component({
  selector: 'app-list-channels',
  imports: [TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, ToastrModule, ConfirmDialogModule],
  templateUrl: './list-channels.component.html',
  styleUrl: './list-channels.component.css',
  providers: [ToastrService, ConfirmationService]
})
export class ListChannelsComponent implements OnInit {
  RawChannels: Channel[] = [];
  Channels: ChannelListView[] = [];
  Loading: boolean = false;
  stationId!: number;
  station!: Station;

  constructor(private channelService: ChannelService,
    private stationService: StationService,
    private dialogService: ConfirmationService,
    private toastService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private oxideService: OxideService,
    private channelTypeService: ChannelTypeService,
    private protocolService: ProtocolService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.stationId = +id;
        this.loadStationDetails(this.stationId);
        this.loadChannels(this.stationId);
      }
    });
  }
  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  loadStationDetails(id: number) {
    this.stationService.GetStationById(id).subscribe({
      next: (data) => {
        this.station = data;
      },
      error: (error) => {
        this.toastService.error('Unable to load station details');
      }

    })
  }
  loadChannels(id: number) {
    this.Loading = true;
    this.channelService.GetAllChannelsByStation(id).subscribe(
      (data) => {
        console.log(data);
        this.RawChannels = data;

        // Create an array to store promises for fetching Oxide, Protocol, ChannelType, and ScalingFactor
        const channelDetailsPromises = this.RawChannels.map(channel => {
          const oxidePromise = this.oxideService.GetOxideById(channel.OxideId).toPromise();
          const protocolPromise = this.protocolService.GetProtocolById(channel.ProtocolId).toPromise();
          const channelTypePromise = this.channelTypeService.GetChannelTypeById(channel.ChannelTypeId).toPromise();

          return Promise.all([oxidePromise, protocolPromise, channelTypePromise])
            .then(([oxide, protocol, channelType]) => {
              const oxideName = oxide ? oxide.OxideName : 'Unknown Oxide';
              const protocolName = protocol ? protocol.ProtocolType : 'Unknown Protocol';
              const channelTypeName = channelType ? channelType.ChannelTypeValue : 'Unknown Channel Type';

              const channelListView: ChannelListView = {
                Id: channel.Id,
                Name: channel.Name,
                LoggingUnits: channel.LoggingUnits,
                Oxide: oxideName,
                Protocol: protocolName,
                ChannelType: channelTypeName,
                ValuePosition: channel.ValuePosition,
                MaximumRange: channel.MaximumRange,
                MinimumRange: channel.MinimumRange,
                Threshold: channel.Threshold,
                CpcbChannelName: channel.CpcbChannelName,
                SpcbChannelName: channel.SpcbChannelName,
                Priority: channel.Priority,
                OutputType: channel.OutputType,
                ConversionFactor: channel.ConversionFactor,
                IsSpcb: channel.IsSpcb,
                IsCpcb: channel.IsCpcb,
                Active: channel.Active,
                CreatedOn: channel.CreatedOn
              };
              return channelListView;
            });
        });

        // Wait for all promises to resolve and update channels
        Promise.all(channelDetailsPromises).then(updatedChannels => {
          this.Channels = updatedChannels;
          this.Loading = false;
        }).catch(error => {
          // this.messageService.add({
          //   severity: 'error',
          //   summary: 'Error Loading Channel Details',
          //   detail: 'An error occurred while loading the channel details. Please try again later.'
          // });
          this.toastService.error('Unable to load Channel Details', 'Error')
          console.error('Error loading channel details:', error);
          this.Loading = false;
        });
      },
      (error) => {
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Error Loading Channels',
        //   detail: 'An error occurred while loading the channels. Please try again later.'
        // });
        this.toastService.error('Unable to load Channels', 'Error')
        console.error('Error loading channels:', error);
        this.Loading = false;
      }
    );
  }
  onCreate() {
    this.router.navigate(['/Channel/Add', this.stationId]);
  }
  onEdit(channel: ChannelListView) {
    this.router.navigate(['/Channel/Edit', channel.Id]);
  }
  onDelete(channel: ChannelListView) {
    this.dialogService.confirm({
      message: 'Are you sure you want to delete this channel?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // User clicked "Yes"
        this.channelService.DeleteChannel(channel).subscribe
          ({
            next: (response) => {
              this.toastService.success('Channel deleted successfully', 'Deleted');
              this.ngOnInit();
            },
            error: (error) => {
              this.toastService.error('Unable To Delete Channel', 'Error')
            }
          })
      },
      reject: () => {
        // User clicked "No"

      },
    });
  }
}
