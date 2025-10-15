import {Component, inject, OnInit} from '@angular/core';
import {Anime, AnimeRpcService} from '../rpc/anime-rpc.service';
import {AnimeDetailComponent} from './detail/anime-detail.component';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {debounceTime, distinctUntilChanged, Subject, switchMap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-anime',
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.scss',
  imports: [
    AnimeDetailComponent,
    AsyncPipe,
  ],
  standalone: true
})
export class AnimeComponent implements OnInit {

  public searchTerm$ = new Subject<string | undefined>();
  public animeList: Anime[] | undefined;
  public selectedAnime: Anime | undefined;

  public searchResults$ = this.searchTerm$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => this.animeRpcService.searchAnime(term)),
    takeUntilDestroyed(),
  );

  private animeRpcService = inject(AnimeRpcService);

  public ngOnInit() {
    this.animeRpcService.getTopAnime().subscribe((animeList) => this.animeList = animeList);
  }

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
