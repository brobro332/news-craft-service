import { IsString } from 'class-validator';

export class CreateParticipantDto {
  @IsString()
  nickname: string;
}
