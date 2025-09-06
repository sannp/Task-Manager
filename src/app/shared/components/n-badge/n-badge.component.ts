
import { Component, input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'n-badge',
  templateUrl: './n-badge.component.html',
  styleUrls: ['./n-badge.component.scss'],
  standalone: true,
  imports: [MatBadgeModule],
})
export class NBadgeComponent {
  content = input<string>();
  color = input<ThemePalette>('primary');
}
