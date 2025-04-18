import { Component, OnInit } from '@angular/core';
import { Station } from '../../Interfaces/Station';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { StationService } from '../../Services/station.service';
import { DataFeedService } from '../../Services/data-feed.service';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChannelDataFeed } from '../../Interfaces/ChannelDataFeed';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OverviewGraphComponent } from '../overview-graph/overview-graph.component';
import { OverviewExceedanceComponent } from '../overview-exceedance/overview-exceedance.component';

@Component({
  selector: 'app-live-feed',
  imports: [ToastrModule, CommonModule, ReactiveFormsModule, OverviewGraphComponent],
  templateUrl: './live-feed.component.html',
  styleUrl: './live-feed.component.css'
})
export class LiveFeedComponent implements OnInit {

  private roleSubscription!: Subscription;
  role: string | null = null;
  stations: Station[] = [];
  dataFeed: ChannelDataFeed[] = [];
  stationDataFeedMap: { [stationId: number]: ChannelDataFeed[] } = {};
  isLoadingMap: { [stationId: number]: boolean } = {};
  isAuthenticated: boolean = false;

  constructor(private stationService: StationService,
    private dataFeedService: DataFeedService,
    private authService: AuthService,
    private router: Router, private toastService: ToastrService) { }
  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.roleSubscription = this.authService.role$.subscribe(role => {
      this.role = role;
      if (this.role) {
        if (this.role == 'Demo') {
          this.router.navigate(['/Users'])
        }
      }
    });
    this.loadStationsAndFeed();
  }

  onRefresh() {
    this.ngOnInit();
  }

  loadStationsAndFeed() {
    this.stationService.GetAllStations().subscribe(
      (stations) => {
        this.stations = stations;

        if (this.stations.length > 0) {
          // this.toastService.success('Loading success.');

          // Initialize loading state for each station
          this.stations.forEach(station => {
            this.isLoadingMap[station.Id] = true;
            this.loadDataFeed(station.Id);
            setInterval(() => {
              this.loadDataFeedInterval(station.Id);
            }, 60000); // 60 seconds
          });
        } else {
          this.toastService.warning('No stations');
        }
      },
      (error) => {
        console.error('Error loading stations:', error);
        this.toastService.error(error.error, 'Stations Loading Failed.');
      }
    );
  }
  loadDataFeedInterval(stationId: number): void {
    console.log('fetching interval');
    this.dataFeedService.GetStationFeed(stationId).subscribe(
      (response) => {
        this.stationDataFeedMap[stationId] = response;
      },
      (error) => {
        console.error(`Error loading data feed for station ${stationId}:`, error);
        this.toastService.error(`Error loading data feed for station ${stationId}.`);
      }
    );
  }
  loadDataFeed(stationId: number): void {
    this.dataFeedService.GetStationFeed(stationId).subscribe(
      (response) => {
        this.stationDataFeedMap[stationId] = response;
        this.isLoadingMap[stationId] = false;  // Stop skeleton loader
      },
      (error) => {
        console.error(`Error loading data feed for station ${stationId}:`, error);
        this.toastService.error(`Error loading data feed for station ${stationId}.`);
        this.isLoadingMap[stationId] = false;
      }
    );
  }
  isDelayed(logTime: Date | null): boolean {
    if (!logTime) return false; // If null, not delayed

    const logDate = new Date(logTime); // Ensure it's a Date object
    const now = new Date(); // Get current time
    const diffInMinutes = (now.getTime() - logDate.getTime()) / (1000 * 60); // Calculate difference in minutes

    return diffInMinutes > 15; // Return true if delayed more than 15 minutes
  }

}
