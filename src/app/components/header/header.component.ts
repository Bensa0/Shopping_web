import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { headerInfo } from './header-info';
import { Subscription } from 'rxjs';
import { HeaderLevelService } from 'src/app/services/header.service';
import { ButtonModule } from 'primeng/button';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'xs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private _headerData: headerInfo[] | undefined;
  private mainHeaderData: headerInfo[] | undefined;
  activeHeader: headerInfo[] | undefined;
  currentLevel: number = 0;
  currentIndex: number = 0;
  private levelSubscription: Subscription;
  private indexSubscription: Subscription;

  constructor(
    private headerLevelService: HeaderLevelService,
    private userService: UserServiceService
  ) {
    this.levelSubscription = this.headerLevelService
    .getCurrentLevel()
    .subscribe((level) => {
      this.currentLevel = level;
    });

    this.indexSubscription = this.headerLevelService
    .getCurrentIndex()
    .subscribe((index) => {
      this.currentIndex = index;
    });
  }

  ngOnInit() {
    this.headerLevelService.updateHeaderLevel(0);
    this.headerLevelService.updateHeaderIndex(0);
    this.headerLevelService.getCurrentLevel();
    this.headerLevelService.getCurrentLevel().subscribe((respond) => {
      console.log(respond);
    });
  }

  ngOnDestroy() {
    this.levelSubscription.unsubscribe();
    this.indexSubscription.unsubscribe();
  }

  @Input('headerData')
  public set headerData(value: headerInfo[] | undefined) {
    if (!value) {
      return;
    }

    this.mainHeaderData = value;

    if (this.currentLevel > 0) {
      this._headerData = value[this.currentIndex]?.children || [];
      this.activeHeader = this._headerData;
    } else {
      this._headerData = value;
      this.activeHeader = value;
    }
  }

  public get headerData(): headerInfo[] | undefined {
    return this._headerData;
  }

  toggleActiveHeader($event: MouseEvent, data: headerInfo) {
    if (!data.children || data.children.length <= 0) {
      return;
    }

    $event.preventDefault();
    this.activeHeader = data.children;
    this.headerLevelService.updateHeaderLevel(this.currentLevel + 1);

    const newIndex = this.mainHeaderData!.indexOf(data);
    this.headerLevelService.updateHeaderIndex(newIndex);
  }

  goBack() {
    if (this.currentLevel <= 0) {
      return;
    }

    this.activeHeader = this.mainHeaderData;
    this.headerLevelService.updateHeaderLevel(this.currentLevel - 1);
    this.headerLevelService.getCurrentLevel();
  }
  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
}
