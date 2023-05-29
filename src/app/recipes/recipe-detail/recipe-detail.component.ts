import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  recipeIndex: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map((params: Params) => {
          return +params['index'];
        }),
        switchMap((index) => {
          this.recipeIndex = index;
          return this.store.select('recipes');
        }),
        map((recipesState) => {
          return recipesState.recipes.find((recipes, index) => {
            return index === this.recipeIndex;
          });
        })
      )
      .subscribe((recipe) => {
        this.recipe = recipe;
      });
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEdit() {
    this.router.navigate(['edit'], {
      relativeTo: this.route,
    });
  }

  onDelete() {
    this.recipeService.deleteRecipe(this.recipeIndex);
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
