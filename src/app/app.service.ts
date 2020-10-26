import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public getContas(): Observable<Agrupador[]> {
        return http.pipe(map(c => this.agrupadas(c)))
    }

    private existe(agrupadas: Agrupador[], inscricao: string): number {
        return agrupadas.findIndex(
            (el: Agrupador) => el.inscricao && el.inscricao === inscricao
        );
    }

    private agrupadas(c: Conta[]): Agrupador[] {
        return c.reduce((acc: Agrupador[], curr: Conta) => {
            const idx = this.existe(acc, curr.inscricao);
            if (idx >= 0) {
                return [
                    ...acc.slice(0, idx),
                    {
                        ...acc[idx],
                        contas: acc[idx].contas.concat(curr.numero)
                    },
                    ...acc.slice(idx + 1)
                ];
            } else {
                return acc.concat({
                    inscricao: curr.inscricao,
                    contas: [curr.numero]
                });
            }
        }, []);
    }
}

export interface Conta {
    inscricao: string;
    numero: string;
}

export interface Agrupador {
    inscricao: string;
    contas: string[];
}

export const http: Observable<Conta[]> = of([{
    numero: "93934-3",
    inscricao: "1234567890"
},
    {
        numero: "95495-5",
        inscricao: "1234567890"
    },
    {
        numero: "123-6",
        inscricao: "1234567890"
    },
    {
        numero: "1112-3",
        inscricao: "1234567890"
    },
    {
        numero: "32329-5",
        inscricao: "1234567890"
    },
    {
        numero: "443-3",
        inscricao: "00012345"
    },
    {
        numero: "223-3",
        inscricao: "00012345"
    },
    {
        numero: "3334-3",
        inscricao: "00012345"
    },
    {
        numero: "12332-3",
        inscricao: "4434043"
    }
]);