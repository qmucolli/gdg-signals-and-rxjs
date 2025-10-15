import {inject, Injectable} from '@angular/core';
import {Anime, AnimeRpcService} from '../rpc/anime-rpc.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {filter, map, Observable, shareReplay, take, tap} from 'rxjs';

@Injectable()
export class AnimeService {
  private readonly animeRpcService = inject(AnimeRpcService);

  public readonly anime$ = this.animeRpcService.getTopAnime().pipe(
    shareReplay(1),
    takeUntilDestroyed(),
  );

  public searchAnime(query: string | undefined): Observable<Anime[]> {
    return this.animeRpcService.getTopAnime().pipe(
      map((anime) => anime.filter(val => val.title.toLowerCase().includes(query?.toLowerCase() || ''))),
      take(1),
    );
  }
}
