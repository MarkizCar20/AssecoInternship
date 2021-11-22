import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ListaService } from 'src/app/services/lista.service';
import { MatSort, Sort, MatSortable } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import {SelectionModel} from '@angular/cdk/collections';
import { first } from 'rxjs';

interface IPost {
  id: number;
  "beneficiaryname": string;
  date: Date;
  direction: string;
  amount: string;
  description: string;
  currency: string;
  mcc: string;
  kind: string;
  split: boolean;
  split_kategorije: string[];
}



interface ICategory {
  
  "parent-code": string;
  code: string;
  name: string;

}

interface IButton {
  name: string;
}

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {


  public categories: any= [];
  public parentCategories: string[] = [];
  public childCategories: ICategory[] = [];
  public chosenId = 0;
  public chosenCode: string = "";
  public chosenParentCode: string = "";
  public chosenIDs: number[] = [];

  public chosenSplitCodes: string[] = [];
  public chosenSplitParentCodes: string[] = [];
  public hasSplits = false;
  public chosenSplitNames: string[] = [];

  public dataSource = new MatTableDataSource<IPost>();
  public posts: IPost[] = [];
  public getTableData: IPost[] = [];
  public displayedColumns: string[] = ['select', 'id', 'beneficiary-name', 'date', 'direction', 'amount', 'currency', 'kind', 'splitMarker', 'mcc']
  public dataString = "";
  public parentArray: ICategory[] = [];
  public noviParentArray: ICategory[] = [];
  public chosenName: string = "";

  public value_form: number = 0;
  public value_form_array: number[] = [];

  public listaKategorija: any[] = [{
    id: 1, 
    listaKategorija1: this.noviParentArray
  }];

  public listaButtons: any[] = [{
    id: 1,
    ime: ""
  }]

  selection = new SelectionModel<IPost>(true, []);
  
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  

  constructor(private ListaService: ListaService, private _liveAnnouncer: LiveAnnouncer ) {
    
   }

   display = false;
   splitdisplay = false;
   onPress(ielement: IPost) {
     this.display = true;
     console.log(ielement);
     this.getTransactionCategories();
     this.chosenId = ielement.id;
     console.log(this.chosenId);
   }
  
  ngOnInit(): void {
    this.ListaService.getTransactionList().subscribe((lista:any) => {
      this.posts = lista.items;
      console.log(this.posts);
      this.dataSource = new MatTableDataSource(this.posts);
    });
  }

  ngAfterViewInit() {
    this.ListaService.getTransactionList().subscribe((lista:any) => {
      this.dataSource = new MatTableDataSource(this.posts);
     this.dataSource.sort = this.sort;
     this.dataSource.paginator = this.paginator;
    });
    
  }

  getTransactionCategories() {
    this.ListaService.getCategories().subscribe( (listica: any) => {
      this.categories = listica;
      console.log(listica);
      const x = listica.items.filter((e : ICategory) => e["parent-code"] == null);
      console.log("----------",x);
      this.parentArray = x;
      
    });
  }

  getSubcategory(kategorija: ICategory) {

    console.log(kategorija.code);
    const y = this.categories.items.filter((e : ICategory) => e["parent-code"] == kategorija.code);
    this.chosenParentCode = kategorija.code;
    this.childCategories = y;
    this.chosenName = kategorija.name;
    console.log(this.listaKategorija);
  }

  
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


  postChanges() {
    console.log(this.selection.selected.length != 0);
    if (this.selection.selected.length != 0) {
      for (let item of this.selection.selected) {
        console.log(item.id);
        this.chosenIDs.push(item.id);
      }
      this.ListaService.setTransaction(this.chosenIDs, this.chosenCode, this.chosenParentCode);
    for (let i = 0; i < this.posts.length; i++) {
      for (let item of this.selection.selected) {
        if (this.posts[i].id == item.id) {
          console.log("Ovde ce se promeniti samo taj jedan podatak.", this.posts[i]);
          this.posts[i].description = this.chosenName;
        }
      }
    }
    }
    else {
      this.ListaService.setTransaction(this.chosenIDs, this.chosenCode, this.chosenParentCode);
    for (let i = 0; i < this.posts.length; i++) {
        if (this.posts[i].id == this.chosenId) {
          console.log("Ovde ce se promeniti samo taj jedan podatak.", this.posts[i]);
          this.posts[i].description = this.chosenName;
        }
    }

    }
    this.display = false;
  }

  cancelChanges() {
    this.display = false;
    this.chosenId = 0;
    this.chosenParentCode = this.chosenCode = "";
  }

  getCode(kategorija: ICategory) {
    this.chosenParentCode = kategorija.code;
    this.chosenCode = kategorija['parent-code'];
    console.log(this.chosenParentCode);
    
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: IPost): any {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    
  }

  onPressSplit(elem: IPost) {
    this.listaKategorija = [{
      id: 1, 
      listaKategorija1: this.noviParentArray
    }];
    if (this.splitdisplay == false) this.splitdisplay = true;
    console.log("lista koju treba obrisati", this.listaKategorija);
    if (this.value_form_array.length != 0) {
      this.value_form_array = [];
      this.chosenSplitNames = [];
      this.chosenSplitParentCodes = [];
      this.chosenSplitCodes = [];
    }

    this.chosenId = elem.id;
    this.getTransactionCategories();

    this.listaKategorija.push({
      id: this.listaKategorija.length +1,
      listaKategorija1: this.parentArray
    });
  }

  removeSplit(i:number) {
    this.listaKategorija.splice(i, 1);
  }

  addSplit(i:number) {
    this.listaKategorija.push({
      id: this.listaKategorija.length +1,
      listaKategorija1: this.parentArray});
      
  }

  onSubmit() {
    this.value_form_array.push(this.value_form);
  }


  cancelSplitChanges() {

    this.splitdisplay= false;
    this.chosenId = 0;
    this.chosenParentCode = this.chosenCode = "";

    this.value_form_array = [];
    this.chosenSplitNames = [];
    this.chosenSplitParentCodes = [];
    this.chosenSplitCodes = [];
  }

  postSplitChanges() {
    
    console.log("niz vrednosti", this.value_form_array);
    if ( this.value_form_array.length != this.chosenSplitParentCodes.length || this.value_form_array.length != this.chosenSplitNames.length || this.value_form_array.length != this.chosenSplitCodes.length ) {
      console.log("Pogresan unos podataka");
      this.cancelSplitChanges;
      this.splitdisplay = false;
    }

    let i2 = 0;
    for (let i = 0; i < this.value_form_array.length; i++) {
      i2 += this.value_form_array[i];
    }

    let i1 = -100;
    let post: IPost = this.posts[1];
    let firstName: string;
    for (let i = 0; i < this.posts.length; i++) {
      if (this.posts[i].id == this.chosenId) {
        i1 = i;
        this.posts[i].split = true;
        this.posts[i].description = this.chosenSplitNames.shift()!;
        this.posts[i].split_kategorije=this.chosenSplitNames;
        post = this.posts[i]; 
      }
    }
    for (let i = 0; i < this.chosenSplitCodes.length; i++) {
      let ime = post.beneficiaryname;
      this.posts.push({
        id: post.id,
        "beneficiaryname": ime,
        date: post.date,
        direction: post.direction,
        amount: post.amount,
        description: post.description,
        currency: post.currency,
        mcc: post.mcc,
        kind: post.kind,
        split: true,
        split_kategorije: post.split_kategorije
      });
      console.log(this.posts);
    }
    
  }

  getSplitCode(kategorija: ICategory) {
    
    this.chosenSplitCodes.push(kategorija.code); 
    console.log("izabran Code", this.chosenSplitCodes);
    this.chosenSplitNames.push(kategorija.name);
    console.log("izabrano ime", this.chosenSplitNames);
    this.hasSplits = true;

    
  }


  getSplitSubcategory(kategorija: ICategory) {

    console.log( "OVDE TREBA DA NADJE KATEGORIJU", kategorija.code);
    const y = this.categories.items.filter((e : ICategory) => e["parent-code"] == kategorija.code);
    this.chosenSplitParentCodes.push(kategorija.code);
    this.childCategories = y;
    console.log("ovde bi trebalo da odradi nalazenje parent code-a", this.chosenSplitParentCodes);
   
  }

  addFormValue() {
    this.value_form_array.push(this.value_form);
  }

}


