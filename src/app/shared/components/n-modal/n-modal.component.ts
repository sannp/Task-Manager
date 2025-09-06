import { Component, input, output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'n-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './n-modal.component.html',
  styleUrls: ['./n-modal.component.scss'],
})
export class NModalComponent {
  title = input<string>();
  isOpen = false;

  closed = output<void>();

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
    this.closed.emit();
  }

  onEscapeKey(event: KeyboardEvent): void {
    if (this.isOpen) {
      this.close();
    }
  }
}
