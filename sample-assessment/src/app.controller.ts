import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RecipeType } from './types';
import { Response } from 'express';

@Controller('recipes')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async recipes(): Promise<{ recipeName: string[] }> {
    return this.appService.getRecipeNames();
  }

  @Get('details/:name')
  async recipeDetails(@Param('name') name: string): Promise<{
    details: {
      ingredients: string[];
      numSteps: number;
    };
  }> {
    return this.appService.getRecipeByName(name);
  }

  @Post()
  async addRecipe(
    @Res() res: Response,
    @Body() body: RecipeType,
  ): Promise<any> {
    try {
      const { exists } = await this.appService.insertRecipe(body);

      if (exists) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Recipe already exists',
        });
      }

      return res.status(HttpStatus.CREATED).send();
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }

  @Put()
  async updateRecipe(
    @Res() res: Response,
    @Body() body: RecipeType,
  ): Promise<any> {
    try {
      const { exists } = await this.appService.updateRecipe(body);

      if (!exists) {
        return res.status(HttpStatus.NOT_FOUND).json({
          error: 'Recipe does not exist',
        });
      }

      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
