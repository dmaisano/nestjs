import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { IncomingHttpHeaders } from 'http';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getVideo(
    res: Response,
    videoPath: string,
    range: string,
  ): Promise<void> {
    const { size: videoSize } = await stat(videoPath);

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1mb
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers: IncomingHttpHeaders = {
      'content-range': `bytes ${start}-${end}/${videoSize}`,
      'accept-ranges': 'bytes',
      'content-length': contentLength.toString(),
      'content-type': 'video/mp4',
    };

    res.writeHead(206, headers);

    const videoStream = createReadStream(videoPath, { start, end });

    videoStream.pipe(res);
  }
}
