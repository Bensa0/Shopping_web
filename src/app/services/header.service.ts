import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderLevelService {
  private currentLevelSubject = new BehaviorSubject<number>(0);
  private currentIndexSubject = new BehaviorSubject<number>(0);

  public currentLevel$: Observable<number> = this.currentLevelSubject.asObservable();
  public currentIndex$: Observable<number> = this.currentIndexSubject.asObservable();

  constructor() {
    this.updateHeaderLevel(0);
    this.updateHeaderIndex(0);
  }

  getCurrentLevel(): Observable<number> {
    return this.currentLevel$;
  }

  updateHeaderLevel(newLevel: number) {
    this.currentLevelSubject.next(newLevel);
    localStorage.setItem('currentLevel', newLevel.toString());
  }

  getCurrentIndex(): Observable<number> {
    return this.currentIndex$;
  }

  updateHeaderIndex(newIndex: number) {
    this.currentIndexSubject.next(newIndex);
    localStorage.setItem('currentIndex', newIndex.toString());
  }
}
