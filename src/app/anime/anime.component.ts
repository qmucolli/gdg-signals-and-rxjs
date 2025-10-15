import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {Anime} from '../rpc/anime-rpc.service';
import {AnimeDetailComponent} from './detail/anime-detail.component';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs';
import {takeUntilDestroyed, toObservable, toSignal} from '@angular/core/rxjs-interop';
import {AnimeService} from './anime.service';

@Component({
  selector: 'app-anime',
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.scss',
  imports: [AnimeDetailComponent],
  standalone: true,
  providers: [AnimeService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimeComponent {
  private readonly animeService = inject(AnimeService);

  public readonly searchTerm = signal<string | undefined>('');
  public readonly selectedAnime = signal<Anime | undefined>(undefined);
  public readonly animeList = toSignal(this.animeService.anime$);

  public searchResults$ = toObservable(this.searchTerm).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => this.animeService.searchAnime(term)),
    takeUntilDestroyed(),
  );
  public searchResults = toSignal(this.searchResults$, {initialValue: []});

  public selectAnime(anime: Anime) {
    this.selectedAnime.set(anime);
  }

  public onSearch(input: string): void {
    this.searchTerm.set(input);
  }

  public clearSelectedAnime() {
    this.selectedAnime.set(undefined);
  }
}
