import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Anime} from '../rpc/anime-rpc.service';
import {AnimeDetailComponent} from './detail/anime-detail.component';
import {AsyncPipe} from '@angular/common';
import {debounceTime, distinctUntilChanged, Subject, switchMap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AnimeService} from './anime.service';

@Component({
  selector: 'app-anime',
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.scss',
  imports: [
    AnimeDetailComponent,
    AsyncPipe,
  ],
  providers: [AnimeService],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimeComponent {
  private readonly animeService = inject(AnimeService);

  public searchTerm$ = new Subject<string | undefined>();
  public selectedAnime: Anime | undefined;

  public searchResults$ = this.searchTerm$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => this.animeService.searchAnime(term)),
    takeUntilDestroyed(),
  );
  public animeList$ = this.animeService.anime$;

  public selectAnime(anime: Anime) {
    this.selectedAnime = anime;
  }

  public onSearch(input: string): void {
    this.searchTerm$.next(input);
  }

  public clearSelectedAnime() {
    this.selectedAnime = undefined;
  }
}
