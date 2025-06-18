import { IsString, Length } from 'class-validator';

export class CreatequizDto {
  @IsString()
  @Length(1, 100)
  title: string;
}
