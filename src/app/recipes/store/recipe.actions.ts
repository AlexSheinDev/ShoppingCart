import { Action } from '@ngrx/store';
import { Recipe } from '../recipe.model';

export const SET_RECIPES = '[Recipes] Set Recipes';
// export const SET_RECIPES = '[Recipes] Set Recipes';

export type RecipesActions = SetRecipes;

export class SetRecipes implements Action {
  readonly type = SET_RECIPES;

  constructor(public payload: Recipe[]) {}
}
