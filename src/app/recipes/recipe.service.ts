import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      'Test Recipe',
      'Test description',
      'https://media.istockphoto.com/id/607299402/photo/culinary-background-with-spices-and-recipe-book.jpg?s=612x612&w=0&k=20&c=IpEqVDztshwHdB6rnprLfOSbh1rtz8aKy5IUIWTmxzw=',
      [new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]
    ),
    new Recipe(
      'Recipe_2',
      'Test description 2',
      'https://media.istockphoto.com/id/607299402/photo/culinary-background-with-spices-and-recipe-book.jpg?s=612x612&w=0&k=20&c=IpEqVDztshwHdB6rnprLfOSbh1rtz8aKy5IUIWTmxzw=',
      [new Ingredient('Buns', 2), new Ingredient('Meat', 2)]
    ),
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
