import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { DatabaseModule } from 'src/database/database.module';
import { StoriesRouter } from './stories.router';

@Module({
  imports: [DatabaseModule],
  providers: [StoriesService, StoriesRouter],
})
export class StoriesModule {}
