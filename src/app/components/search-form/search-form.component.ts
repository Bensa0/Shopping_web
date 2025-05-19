import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaIconDirective } from '../dirctive/fa-icon.directive';
import { FilterPipe } from 'src/app/components/pipe/filter.pipe';

interface icons {
  name: string;
  icon: string;
}
@Component({
  selector: 'xs-search-form',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconDirective, FilterPipe],
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent {
  constructor(private filterPipe: FilterPipe) {
    this.searchText = '';
    this.selectedIcon = '';
  }


  icons: icons[] = [
    { name: 'Food', icon: 'fa-utensils' },
    { name: 'Apparel', icon: 'fa-shirt' },
    { name: 'Electronics', icon: 'fa-bolt' },
    { name: 'Furniture', icon: 'fa-couch' },
    { name: 'Clear', icon: 'fa-solid fa-circle-minus' },
  ];
  categories: string[] = this.icons.map((icon) => icon.name.toLowerCase());
  selectedIcon!: string;
  previousIcon!: HTMLElement;
  @Output() searchTextChange = new EventEmitter<string>();
  searchText: string = '';
  filterSelected: boolean = false;
  sendSearchText(): void {
    const searchQuery = this.selectedIcon
      ? `${this.searchText}`
      : this.searchText;
    this.searchTextChange.emit(searchQuery);
    if (this.selectedIcon || this.searchText) {
      this.filterSelected = true;
    } else {
      this.filterSelected = false;
    }
  }

  changeColor(iconDiv: any) {
    if (this.previousIcon) {
      this.previousIcon.classList.remove('selected');
    }
    const faIcon = iconDiv.querySelector('.fa');
    faIcon.classList.add('selected');
    this.previousIcon = faIcon;
  }
  applyFilter(filterType: string) {
    this.searchText = filterType;
    this.filterSelected = true;
  }
  onIconClick(iconDiv: HTMLElement, iconName: string) {
    if (iconName === 'Clear') {
      this.clearFilter();
    }
    else if (this.selectedIcon === iconName) {
      this.clearFilter();
    } else {
      this.changeColor(iconDiv);
      this.applyFilter(iconName);
      this.selectedIcon = iconName;
      this.sendSearchText();
    }
  }

  clearFilter() {
    this.searchText = '';
    this.filterSelected = false;
    this.selectedIcon = '';
  }
}
