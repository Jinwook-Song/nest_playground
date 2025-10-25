import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from '../mikro-orm.config';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MigrationRunnerService } from './migration-runner.service';
import { TodoModule } from './todo/todo.module';
import { ProfileModule } from './profile/profile.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    UserModule,
    TodoModule,
    ProfileModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService, MigrationRunnerService],
})
export class AppModule {}
