import { Component, input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemePalette } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'n-icon-button',
  templateUrl: './n-icon-button.component.html',
  styleUrls: ['./n-icon-button.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
})
export class NIconButtonComponent {
  icon = input<string>();
  color = input<ThemePalette>();
  type = input<'button' | 'submit' | 'reset'>('button');
  tooltip = input<string>();

  @Output() click = new EventEmitter<MouseEvent>(); // Change to MouseEvent
}