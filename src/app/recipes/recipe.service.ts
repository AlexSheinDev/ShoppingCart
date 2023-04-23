import { Recipe } from './recipe.model';
import { EventEmitter } from '@angular/core';

export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'Test Recipe',
      'Test description',
      'https://media.istockphoto.com/id/607299402/photo/culinary-background-with-spices-and-recipe-book.jpg?s=612x612&w=0&k=20&c=IpEqVDztshwHdB6rnprLfOSbh1rtz8aKy5IUIWTmxzw='
    ),
    new Recipe(
      'Recipe_2',
      'Test description 2',
      'https://media.istockphoto.com/id/607299402/photo/culinary-background-with-spices-and-recipe-book.jpg?s=612x612&w=0&k=20&c=IpEqVDztshwHdB6rnprLfOSbh1rtz8aKy5IUIWTmxzw='
    ),
  ];

  getRecipes() {
    return this.recipes.slice();
  }
}
