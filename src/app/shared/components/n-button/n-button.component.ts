import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { CommonModule } from '@angular/common';

export type NButtonVariant = 'text' | 'elevated' | 'outlined' | 'filled' | 'tonal';

@Component({
  selector: 'n-button',
  templateUrl: './n-button.component.html',
  styleUrls: ['./n-button.component.scss'],
  standalone: true,
  imports: [MatButtonModule, CommonModule],
})
export class NButtonComponent {
  color = input<ThemePalette>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<NButtonVariant>('filled');
  disabled = input<boolean>(false);
}