import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Anime } from '../../rpc/anime-rpc.service'; // Use the same interface

@Component({
  selector: 'app-anime-detail',
  standalone: true,
  imports: [],
  templateUrl: './anime-detail.component.html',
  styleUrls: ['./anime-detail.component.scss']
})
export class AnimeDetailComponent {
  // Receives the anime data from the parent component.
  // It's required because this component should never exist without an anime.
  @Input({ required: true }) anime!: Anime;

  // Emits an event to the parent when the close button is clicked.
  @Output() close = new EventEmitter<void>();
}
