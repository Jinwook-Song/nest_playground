import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Profile } from './profile.entity';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Profile] })],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
