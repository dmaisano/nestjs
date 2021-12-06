export type RecipesType = {
  recipes: RecipeType[];
};

export type RecipeType = {
  name: string;
  ingredients: string[];
  instructions: string[];
};
