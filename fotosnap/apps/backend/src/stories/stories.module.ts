import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [StoriesService],
})
export class StoriesModule {}
