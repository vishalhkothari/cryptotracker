import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';


interface Holding {
    crypto: string,
    currency: string,
    amount: number,
    value?: number,
}


@Injectable()
export class HoldingsProvider {
    public holdings: Holding[] = []; //set 'holdings' as a blank array

    constructor(private http: HttpClient, private storage: Storage) {

    }

    addHolding(holding: Holding): void { //adds to qeue, gets new price & saves
    
        this.holdings.push(holding);
        this.fetchPrices();
        this.saveHoldings();
    }


    removeHolding(holding): void { //removes from qeue
 
        this.holdings.splice(this.holdings.indexOf(holding), 1);
        this.fetchPrices();
        this.saveHoldings();
 
    }
 
    saveHoldings(): void { //saves locally
        this.storage.set('cryptoHoldings', this.holdings);
    }
 
    loadHoldings(): void {
 
        this.storage.get('cryptoHoldings').then(holdings => {
 
            if(holdings !== null){
                this.holdings = holdings;
                this.fetchPrices();
            }
        });
 
    }



    verifyHolding(holding): Observable<any> {
        return this.http.get('https://api.cryptonator.com/api/ticker/' + holding.crypto + '-' + holding.currency);
    }
 
    fetchPrices(refresher?): void {
 
        let requests = [];
 
        for(let holding of this.holdings){
 
            let request = this.http.get('https://api.cryptonator.com/api/ticker/' + holding.crypto + '-' + holding.currency);
 
            requests.push(request);
 
        }
 
        forkJoin(requests).subscribe(results => {
 
            results.forEach((result: any, index) => {
 
                this.holdings[index].value = result.ticker.price;
                //var rt = this.holdings[index].value * this.holdings[index].amount; //new
                //rt += this.holdings[index].total;
 
            });
 
            if(typeof(refresher) !== 'undefined'){
                refresher.complete();
            }
 
            this.saveHoldings();
 
        }, err => {
 
            if(typeof(refresher) !== 'undefined'){
                refresher.complete();
            }
 
        });
 
    }
 
}
