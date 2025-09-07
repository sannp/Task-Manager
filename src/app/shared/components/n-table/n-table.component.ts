import {
  Component,
  input,
  ViewChild,
  OnInit,
  AfterViewInit,
  TemplateRef,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

export interface NTableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  template?: TemplateRef<any>;
}

@Component({
  selector: 'n-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './n-table.component.html',
  styleUrls: ['./n-table.component.scss'],
})
export class NTableComponent<T extends { id?: number }> implements OnInit, AfterViewInit { // Add generic constraint
  columns = input<NTableColumn[]>([]);
  data = input<T[]>([]);

  displayedColumns = computed<string[]>(() => this.columns().map(column => column.key));
  dataSource = new MatTableDataSource<T>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataSource.data = this.data();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}