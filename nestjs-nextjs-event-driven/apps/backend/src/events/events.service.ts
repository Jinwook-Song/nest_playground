import { Injectable } from '@nestjs/common';
import { finalize, interval, map, merge, Observable, Subject } from 'rxjs';

@Injectable()
export class EventsService {
  private userStreams = new Map<string, Subject<any>>();

  private getOrCreateStream(userId: string): Subject<any> {
    if (!this.userStreams.has(userId)) {
      this.userStreams.set(userId, new Subject<any>());
    }
    return this.userStreams.get(userId)!;
  }

  getEvent$(userId: string): Observable<MessageEvent> {
    const userStrema = this.getOrCreateStream(userId);

    const keepAlive$ = interval(25000).pipe(
      map(() => ({ comment: 'keep-alive' })),
    );

    return merge(userStrema.asObservable(), keepAlive$).pipe(
      finalize(() => {
        console.log(`🚩 User ${userId} disconnected`);
        this.userStreams.delete(userId);
      }),
    );
  }

  sendEvent(userId: string, eventType: string, data = {}) {
    const userStrema = this.userStreams.get(userId);
    if (userStrema) {
      userStrema.next({
        data: {
          eventType,
          ...data,
        },
      });
    }
  }
}
