import {inject, Injectable} from "@angular/core";
import {Anime, AnimeRpcService} from "../rpc/anime-rpc.service";
import {map, Observable, shareReplay} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable()
export class AnimeService {
    private readonly animeRpcService = inject(AnimeRpcService);

    public anime$ = this.animeRpcService.getTopAnime().pipe(
        shareReplay(1),
        takeUntilDestroyed(),
    );

    public searchAnime(name: string | undefined): Observable<Anime[]> {
        return this.anime$.pipe(
            map(anime => anime.filter(a => a.title.toLowerCase().includes(name?.toLowerCase() || ''))),
        );
    }
}
