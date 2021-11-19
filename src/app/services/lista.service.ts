import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListaService {

  constructor(private http: HttpClient) { }
  //https://jsonplaceholder.typicode.com/users
  public getTransactionList() {
    return this.http.get("http://127.0.0.1:4010/transactions?transaction-kind=iure&start-date=1995-01-10T23%3A00%3A00.0Z&end-date=2021-03-03T23%3A00%3A00.0Z&page=502&page-size=415&sort-by=corporis&sort-order=desc")
  }
  
  public setTransaction(idbroj: number, parentID:string, childID:string) {
    this.http.post(`http://127.0.0.1:4010/transaction/${idbroj}/categorize`, {idbroj, parentID, childID},);
    console.log(idbroj, parentID, childID);
  }
  public addTransaction() {
    //..
  }

  public removeTransaction() {
    //
  }

  public updateTransaction() {
    //
  }

  public getCategories() {
    return this.http.get(" http://127.0.0.1:4010/categories?parent-id=sed");
  }
}
