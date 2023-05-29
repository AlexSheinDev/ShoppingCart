import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  recipeIndex: number;
  isEditMode = false;
  recipe: Recipe;
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipeService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params['index'] != null) {
        this.recipeIndex = +params['index'];
        this.isEditMode = true;
      }
      this.getRecipe();
      this.initForm();
    });
  }

  private initForm() {
    let recipeIngredients = new FormArray([]);

    if (this.isEditMode && this.recipe.ingredients) {
      for (let ingredient of this.recipe.ingredients) {
        recipeIngredients.push(
          new FormGroup({
            name: new FormControl(ingredient.name, Validators.required),
            amount: new FormControl(ingredient.amount, [
              Validators.required,
              Validators.pattern(/^[1-9]+[0-9]*$/),
            ]),
          })
        );
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(this.recipe.name, Validators.required),
      imagePath: new FormControl(this.recipe.imagePath, Validators.required),
      description: new FormControl(
        this.recipe.description,
        Validators.required
      ),
      ingredients: recipeIngredients,
    });
  }

  onSubmit() {
    if (this.isEditMode) {
      this.recipesService.updateRecipe(this.recipeIndex, this.recipeForm.value);
    } else {
      this.recipesService.addRecipe(this.recipeForm.value);
    }

    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  getRecipe() {
    if (this.isEditMode) {
      // this.recipe = this.recipesService.getRecipe(this.recipeIndex);
      this.store
        .select('recipes')
        .pipe(
          map((recipesState) => {
            return recipesState.recipes.find((recipe, index) => {
              return index == this.recipeIndex;
            });
          })
        )
        .subscribe((recipe) => (this.recipe = recipe));
    } else {
      this.recipe = new Recipe('', '', '', []);
    }
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ),
      })
    );
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
