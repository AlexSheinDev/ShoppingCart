import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  recipeIndex: number;
  isEditMode = false;
  recipe: Recipe;
  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params['index'] != null) {
        this.recipeIndex = +params['index'];
        this.isEditMode = true;
      }
      this.getRecipe();
    });
  }

  getRecipe() {
    if (this.isEditMode) {
      this.recipe = this.recipesService.getRecipe(this.recipeIndex);
    } else {
      this.recipe = new Recipe('', '', '', []);
    }
  }
}
