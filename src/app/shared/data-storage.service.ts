import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import * as RecipesActions from '../recipes/store/recipe.actions';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  private recipesTableName: string = 'recipes.json';
  private firebaseStorageUrl: string =
    'https://shopping-list-angular-8b676-default-rtdb.europe-west1.firebasedatabase.app/';

  constructor(
    private client: HttpClient,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.client
      .put(this.firebaseStorageUrl + this.recipesTableName, recipes)
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.client
      .get<Recipe[]>(this.firebaseStorageUrl + this.recipesTableName)
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          this.store.dispatch(new RecipesActions.SetRecipes(recipes));
        })
      );
  }
}
