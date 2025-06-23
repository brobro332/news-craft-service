import { IsString } from 'class-validator';

export class CreateParticipantDto {
  @IsString()
  userId: string;

  @IsString()
  nickname: string;
}
