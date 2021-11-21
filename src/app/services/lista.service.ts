import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListaService {

  constructor(private http: HttpClient) { }
  //https://jsonplaceholder.typicode.com/users
  public getTransactionList() {
    return this.http.get("http://127.0.0.1:4010/transactions?transaction-kind=minima&start-date=2001-06-20T22%3A00%3A00.0Z&end-date=1947-08-06T23%3A00%3A00.0Z&page=405&page-size=429&sort-by=dicta&sort-order=asc")
  }
  
  public setTransaction(idbroj: number[], parentID:string, childID:string) {
    if (idbroj.length > 0) {
      for (let i = 0; i < idbroj.length; i ++) {
      this.http.post(`http://127.0.0.1:4010/transaction/${idbroj}/categorize`, {idbroj, parentID, childID},);
      console.log(idbroj, parentID, childID);
    }
    }
    else {
      this.http.post(`http://127.0.0.1:4010/transaction/${idbroj}/categorize`, {idbroj, parentID, childID},);
      console.log(idbroj, parentID, childID);
    }
    
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
