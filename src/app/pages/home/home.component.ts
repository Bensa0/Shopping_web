import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FaIconDirective } from 'src/app/components/dirctive/fa-icon.directive';
import { HeaderLevelService } from 'src/app/services/header.service';
interface TestimonialItem {
  imageSrc: string;
  icon: string;
  heading: string;
  description: string;
  category: string;
}
@Component({
  selector: 'xs-home',
  standalone:true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule,FaIconDirective]
})
export class HomeComponent {
  constructor(private router: Router) {}
  testimonials: TestimonialItem[] = [
    {
      imageSrc: 'assets/food.jpg',
      icon:'fa-utensils',
      heading: 'Groceries and Food',
      description:
        'Shop Essential Groceries & Food Online. Convenience at Your Fingertips.',
      category: 'food',
    },
    {
      imageSrc: 'assets/apparel.jpg',
      icon:'fa-shirt',
      heading: 'Apparel and Fashion',
      description:
        'Explore Latest Apparel & Fashion Online. Redefine Your Unique Style.',
      category: 'apparel',
    },
    {
      imageSrc: 'assets/Tech.jpg',
      icon:'fa-bolt',
      heading: 'Electronics and Tech',
      description:
        'Explore Cutting-Edge Electronics Online. Upgrade Your Tech Today.',
      category: 'electronics',
    },
    {
      imageSrc: 'assets/furniture.webp',
      icon:'fa-couch',
      heading: 'Home and Furniture',
      description:
        'Discover Home & Furniture Online. Elevate Comfort and Style.',
      category: 'furniture',
    },
    // Add more testimonial items if needed
  ];
  searchText = ''
  filterProduct(category: string) {
    // Apply filtering logic based on the category
    this.searchText = category.toLowerCase(); // Assuming you have searchText property for filtering
    console.log('Filter Product',this.searchText)
    this.router.navigate(['/shop-view'], { queryParams: { searchText: this.searchText } });
  }

}
