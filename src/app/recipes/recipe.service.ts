import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];
  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Test Recipe',
  //     'Test description',
  //     'https://media.istockphoto.com/id/607299402/photo/culinary-background-with-spices-and-recipe-book.jpg?s=612x612&w=0&k=20&c=IpEqVDztshwHdB6rnprLfOSbh1rtz8aKy5IUIWTmxzw=',
  //     [new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]
  //   ),
  //   new Recipe(
  //     'Recipe_2',
  //     'Test description 2',
  //     'https://media.istockphoto.com/id/607299402/photo/culinary-background-with-spices-and-recipe-book.jpg?s=612x612&w=0&k=20&c=IpEqVDztshwHdB6rnprLfOSbh1rtz8aKy5IUIWTmxzw=',
  //     [new Ingredient('Buns', 2), new Ingredient('Meat', 2)]
  //   ),
  // ];

  constructor(private shoppingListService: ShoppingListService) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }
  updateRecipe(index: number, updRecipe: Recipe) {
    this.recipes[index] = updRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
