import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ListaService } from 'src/app/services/lista.service';
import { MatSort, Sort, MatSortable } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';

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

  public dataSource = new MatTableDataSource<IPost>();
  public posts: IPost[] = [];
  public displayedColumns: string[] = ['id', 'beneficiary-name', 'date', 'direction', 'amount', 'currency', 'kind', 'splitMarker', 'mcc']
  public dataString = "";
  //public dataSource = new MatTableDataSource();
  public parentArray: ICategory[] = [];
  
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
      //this.dataSource.sort= this.sort
      this.posts = lista.items;
      console.log(this.posts);
      this.dataSource = new MatTableDataSource(this.posts);
      //this.getTransactionCategories();
     //this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    this.ListaService.getTransactionList().subscribe((lista:any) => {
     this.dataSource.sort = this.sort;
     this.dataSource.paginator = this.paginator;
    });
    
    //Object.filter(element => element.parent == "");
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
    // console.log(this.categories.items);
    const y = this.categories.items.filter((e : ICategory) => e["parent-code"] == code);
    this.chosenParentCode = code;
    this.childCategories = y;

  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


  postChanges() {
    this.ListaService.setTransaction(this.chosenId, this.chosenCode, this.chosenParentCode);
    let i1 = 0;
    for (let i = 0; i < this.posts.length; i++) {
      if ((this.posts.filter((e: IPost) => e.id == this.chosenId))) {
        console.log("OVO JE PODATAK KADA NIJE PROMENJEN", this.posts[i]);
        this.posts[i].mcc = this.chosenCode;
        i1 = i;
        console.log("OVO JE PROMENJEN PODATAK",this.posts[i]);
      }
    }
    console.log("OVO JE PROMENJEN PODATAK",this.posts[i1]);

    
    
  }

  cancelChanges() {
    this.display = false;
  }

  getCode(kategorija: ICategory) {
    this.chosenParentCode = kategorija.code;
    this.chosenCode = kategorija['parent-code'];
    console.log(this.chosenParentCode);
  }

}


