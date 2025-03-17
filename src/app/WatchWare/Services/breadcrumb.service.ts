import { Injectable } from '@angular/core';
import { BreadcrumbItem } from '../Interfaces/Breadcrumb';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private breadcrumbSource = new BehaviorSubject<BreadcrumbItem[]>([]);
  breadcrumbItems$ = this.breadcrumbSource.asObservable();

  setBreadcrumbItems(items: BreadcrumbItem[]) {
    this.breadcrumbSource.next(items);
  }
}
