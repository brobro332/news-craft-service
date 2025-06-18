import { HttpException, HttpStatus } from '@nestjs/common';

export class RssCollectFailedException extends HttpException {
  constructor(reason?: string) {
    super(
      reason
        ? `RSS 데이터 수집 실패: ${reason}`
        : 'RSS 데이터 수집에 실패했습니다.',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
