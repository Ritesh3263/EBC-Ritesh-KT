import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'search-box',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  @Output() text = new EventEmitter<any>();
  @Input() placeholder = 'Search';
  constructor() { }

  ngOnInit() {
  }

  searchAction(text: any) {
    
    this.text.emit(text);
  }

}
