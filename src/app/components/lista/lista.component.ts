import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ListaService } from 'src/app/services/lista.service';
import { MatSort, Sort, MatSortable } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import {SelectionModel} from '@angular/cdk/collections';

interface IPost {
  id: number;
  beneficiaryname: string;
  date: Date;
  direction: string;
  amount: string;
  description: string;
  currency: string;
  mcc: string;
  kind: string;
}

interface ICategory {
  
  "parent-code": string;
  code: string;
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

  public dataSource = new MatTableDataSource<IPost>();
  public posts: IPost[] = [];
  public getTableData: IPost[] = [];
  public displayedColumns: string[] = ['select', 'id', 'beneficiary-name', 'date', 'direction', 'amount', 'currency', 'kind', 'splitMarker', 'mcc']
  public dataString = "";
  public parentArray: ICategory[] = [];

  selection = new SelectionModel<IPost>(true, []);
  
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  constructor(private ListaService: ListaService, private _liveAnnouncer: LiveAnnouncer ) {
    
   }

   display = false;
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

  getSubcategory(code: string) {

    console.log(code);
    const y = this.categories.items.filter((e : ICategory) => e["parent-code"] == code);
    this.chosenParentCode = code;
    this.childCategories = y;

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
          this.posts[i].mcc = this.chosenCode;
        }
      }
    }
    }
    else {
      this.ListaService.setTransaction(this.chosenIDs, this.chosenCode, this.chosenParentCode);
    for (let i = 0; i < this.posts.length; i++) {
        if (this.posts[i].id == this.chosenId) {
          console.log("Ovde ce se promeniti samo taj jedan podatak.", this.posts[i]);
          this.posts[i].mcc = this.chosenCode;
        }
    }

    }
    
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

}


