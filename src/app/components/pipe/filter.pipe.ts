import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone:true
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: String): any[] {
    if (!items || !searchText) return items;
    searchText = searchText.toLowerCase();

    return items.filter((item) => {
      const name = item.product.name.toLowerCase();
      const description = item.product.description.toLowerCase();
      const category = item.product.category.toLowerCase();
      return name.includes(searchText) || description.includes(searchText)|| category.includes(searchText);
    });
  }
}
