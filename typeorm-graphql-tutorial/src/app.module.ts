import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault as ApolloSandbox } from 'apollo-server-core';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetsModule } from './pets/pets.module';
import { OwnersModule } from './owners/owners.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: false,
      playground: false,
      plugins: [ApolloSandbox()],
      autoSchemaFile: join(process.cwd(), `src/schema.gql`),
    }),
    TypeOrmModule.forRoot({
      type: `sqlite`,
      database: join(__dirname, `../data.db`),
      entities: [`dist/**/*.entity{.ts,.js}`],
      synchronize: true,
      logging: true,
    }),
    PetsModule,
    OwnersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
