import { Component } from "@angular/core";
import { Agrupador, AppService } from "./app.service";
import { Observable, Subject } from "rxjs";

@Component({
  selector: "app-root",
  template: `
    <app-conta-form (saida)="onSaidaHandler($event)" [contas]="contas$ | async">
    </app-conta-form>
    <ng-container *ngIf="saida$ | async as s">
      {{ s | json }}
    </ng-container>
  `,
  styles: [],
})
export class AppComponent {
  public readonly contas$: Observable<Agrupador[]>;
  public readonly saida$ = new Subject<string[]>();

  constructor(private service: AppService) {
    this.contas$ = this.service.getContas();
  }

  onSaidaHandler($event) {
    console.log($event);
    this.saida$.next($event);
  }
}
