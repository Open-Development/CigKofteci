import { Component } from '@angular/core';
import { Game } from 'src/Game';
import { timer, Observable, Subject, Subscription, interval } from 'rxjs';
import { switchMap, takeUntil, catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  private game: Game;

  private updateSubscription: Subscription;
  private timeInterval$ = interval(200);

  constructor() {
    this.game = new Game();    
  }

  ngOnInit() {
    this.updateSubscription = this.timeInterval$.subscribe(val => this.Update());
  }

  ngOnDestroy() {
     this.updateSubscription.unsubscribe();
  }

  private Update() {
    this.game.BuyItem();
    this.game.UpdateDemandRate();
    this.game.CalcProduction();
  }

 

}
