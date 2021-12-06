import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { RecipesType, RecipeType } from './types';
import { DATA_FILE_PATH } from './utils';

@Injectable()
export class AppService {
  private data: RecipesType;

  constructor() {
    this.loadData();
  }

  private async loadData(): Promise<RecipesType> {
    let res = {} as RecipesType;

    try {
      const file = await readFile(DATA_FILE_PATH, {
        encoding: `utf-8`,
      });
      res = JSON.parse(file);
    } catch (error) {
      res = {
        recipes: [],
      };
    }

    this.data = res;
    return res;
  }

  private async writeData(data: RecipesType): Promise<boolean> {
    try {
      await writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), {
        encoding: `utf-8`,
      });

      // update
      this.data = data;
      return true;
    } catch (error) {
      return false;
    }
  }

  private findRecipeByName(name: string): RecipeType | null {
    for (const recipe of this.data.recipes) {
      if (recipe.name === name) {
        return recipe;
      }
    }

    return null;
  }

  async getRecipeNames(): Promise<{ recipeName: string[] }> {
    return {
      recipeName: this.data?.recipes?.map((recipe) => recipe.name) || [],
    };
  }

  async getRecipeByName(name: string): Promise<{
    details: {
      ingredients: string[];
      numSteps: number;
    };
  }> {
    try {
      if (!name) return {} as any;
      const recipe = this.findRecipeByName(name);
      if (!recipe) return {} as any;

      return {
        details: {
          ingredients: recipe.ingredients,
          numSteps: recipe.instructions?.length,
        },
      };
    } catch (error) {
      return {} as any;
    }
  }

  async insertRecipe(recipe: RecipeType): Promise<{ exists: boolean }> {
    try {
      if (!recipe) throw new Error(`No recipe provided`);
      await this.loadData();

      if (this.data.recipes.some((r) => r.name === recipe.name)) {
        return { exists: true };
      }

      await this.writeData({ recipes: [...this.data.recipes, recipe] });
      return { exists: false };
    } catch (error) {
      throw error;
    }
  }
  async updateRecipe(recipe: RecipeType): Promise<{ exists: boolean }> {
    try {
      if (!recipe) throw new Error(`No recipe provided`);
      await this.loadData();

      const index = this.data.recipes.findIndex((r) => r.name === recipe.name);

      if (index !== -1) {
        this.data.recipes[index] = recipe;
        await this.writeData({ recipes: this.data.recipes });
        return { exists: true };
      }

      return { exists: false };
    } catch (error) {
      throw error;
    }
  }
}
