import { Component, OnInit } from '@angular/core';
import { headerInfo } from './components/header/header-info';
import { Router } from '@angular/router';
import { FilterPipe } from './components/pipe/filter.pipe';
import { HeaderLevelService } from './services/header.service';

@Component({
  selector: 'xs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ FilterPipe ]
})
export class AppComponent implements OnInit {
  constructor(private router: Router,private headerLevelService:HeaderLevelService) {}
  ngOnInit(): void {
    this.headerLevelService.updateHeaderLevel(0);
    this.headerLevelService.updateHeaderIndex(0);
    this.headerLevelService.getCurrentLevel();
  }

  headerDB: Array<headerInfo> = [
    { header: 'Home', href: 'home' },
    {
      header: 'Shop',
      children: [
        { header: 'Shop View', href: 'shop-view' },
        { header: 'Shop Cart', href: 'shop' },
      ],
    },
    {
      header: 'Registerations',
      children: [
        { header: 'Sign in', href: 'sign-in' },
        { header: 'Sign up', href: 'sign-up' },
      ],
    },
  ];
}
