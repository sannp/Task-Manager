import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemePalette } from '@angular/material/core';

import { NTableComponent, NTableColumn } from '../n-table/n-table.component';
import { NInputComponent } from '../n-input/n-input.component';
import { NButtonComponent } from '../n-button/n-button.component';
import { NIconButtonComponent } from '../n-icon-button/n-icon-button.component';
import { NDialogService } from '../../services/n-dialog.service';

export interface ListTableAction<T> {
  icon: string;
  color?: ThemePalette;
  tooltip: string;
  action: (item: T) => void;
}

@Component({
  selector: 'app-list-table',
  standalone: true,
  imports: [CommonModule, NTableComponent, NInputComponent, NButtonComponent, NIconButtonComponent],
  templateUrl: './list-table.component.html',
  styleUrls: ['./list-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListTableComponent<T extends { id: number }> implements AfterViewInit {
  columns = input.required<NTableColumn[]>();
  data = input.required<T[]>();
  actions = input<ListTableAction<T>[]>([]);
  title = input<string>();

  viewAction = input(true);
  editAction = input(true);
  deleteAction = input(true);

  add = output();
  view = output<T>();
  edit = output<T>();
  delete = output<T>();

  search = output<string>();

  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  displayedColumns: NTableColumn[] = [];

  private nDialogService = inject(NDialogService);

  ngAfterViewInit(): void {
    this.displayedColumns = [
      ...this.columns(),
      { key: 'actions', header: 'Actions', template: this.actionsTemplate },
    ];
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }

  confirmDelete(item: T): void {
    this.nDialogService.confirm(
      'Confirm Deletion',
      'Are you sure you want to delete this item? This action cannot be undone.'
    ).subscribe(result => {
      if (result) {
        this.delete.emit(item);
      }
    });
  }
}
