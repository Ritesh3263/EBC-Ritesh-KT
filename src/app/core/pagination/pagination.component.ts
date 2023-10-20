import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() paginationList: any;
  @Input() selectedPageLimit: any = environment.defaultPageLimit;
  @Input() currentPage: number;
  @Input() PageLimit: any = environment.pageLimit;
  @Output() onPageChange = new EventEmitter()

  getPage(page: number, limit: number) {
    // if (this.currentPage != page || this.selectedPageLimit != limit) {
    this.currentPage = page;
    this.selectedPageLimit = limit;
    this.onPageChange.emit({
      page: this.currentPage,
      limit: this.selectedPageLimit
    });
    // }
  }

  constructor() { }

  ngOnInit() { }

}
