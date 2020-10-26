import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Agrupador } from "../app.service";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";

@Component({
  selector: "app-conta-form",
  template: ` <form [formGroup]="form" (ngSubmit)="doSubmit()">
    <ul>
      <li *ngFor="let ag of agrupadas">
        <mat-checkbox
          [value]="ag.inscricao"
          [checked]="false"
          (change)="selecionaGrupo($event)"
          [formGroupName]="ag.inscricao"
        >
          {{ ag.inscricao }}
        </mat-checkbox>
        <ul [formArrayName]="ag.inscricao">
          <li *ngFor="let c of ag.contas; let i = index">
            <mat-checkbox [checked]="false" [formControlName]="i" [value]="c">
              {{ c }}
            </mat-checkbox>
          </li>
        </ul>
      </li>
    </ul>
    <button mat-raised-button color="primary" type="submit">Enviar</button>
  </form>`,
  styles: [],
})
export class ContaFormComponent {
  @Output("saida")
  public readonly emitter = new EventEmitter<string[]>();
  public readonly form: FormGroup;
  public agrupadas: Agrupador[];

  constructor(private builder: FormBuilder) {
    this.form = builder.group({});
  }

  selecionaGrupo($event: MatCheckboxChange) {
    const grupo = this.form.get($event.source.value) as FormArray;
    grupo.controls.forEach((el) => el.patchValue($event.checked));
  }

  doSubmit() {
    this.emitter.emit(
      this.agrupadas.reduce<string[]>(
        (prev, curr) =>
          prev.concat(
            curr.contas.filter((_, idx) => {
              return (this.form.get(curr.inscricao) as FormArray).controls[idx]
                .value;
            })
          ),
        []
      )
    );
  }

  @Input()
  set contas(agrupadas: Agrupador[]) {
    agrupadas.forEach((a) => {
      const formContas: FormArray = this.builder.array(
        a.contas.map(() => this.builder.control(false))
      );
      this.form.addControl(a.inscricao, formContas);
    });
    this.agrupadas = agrupadas;
  }
}
