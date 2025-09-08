import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-help-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help-bubble.html',
  styleUrl: './help-bubble.css'
})
export class HelpBubble { open = false; }
