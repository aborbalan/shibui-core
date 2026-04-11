import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComponentsModule } from './domain/components/components.module';
import { CategoriesModule } from './domain/categories/categories.module';
import { ExamplesModule } from './domain/examples/examples.module';
import { UsersModule } from './domain/users/users.module';

@Module({
  imports: [UsersModule, ComponentsModule, CategoriesModule, ExamplesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
