import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root() {
    // render index.hbs view
  }

  @Get('video')
  async video(@Req() req: Request, @Res() res: Response) {
    const range = req.headers.range;

    if (!range) {
      res.status(400).send(`Requires Range header`);
    }

    // hard coded video path
    const videoPath = join(__dirname, '../static/sample_video.mp4');

    await this.appService.getVideo(res, videoPath, range);
  }
}
