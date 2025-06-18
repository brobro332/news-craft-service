import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizModule } from './modules/quiz/quiz.module';
import { QuestionModule } from './modules/question/question.module';
import { QuizSessionModule } from './modules/quiz-session/quiz-session.module';
import { ParticipantModule } from './modules/participant/participant.module';
import { AnswerModule } from './modules/answer/answer.module';
import { ScoreModule } from './modules/score/score.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: +configService.get('POSTGRES_EXTERNAL_PORT'),
        username: configService.get('DATA_POSTGRES_USERNAME'),
        password: configService.get('DATA_POSTGRES_PASSWORD'),
        database: configService.get('DATA_POSTGRES_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    QuizModule,
    QuestionModule,
    QuizSessionModule,
    ParticipantModule,
    AnswerModule,
    ScoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
