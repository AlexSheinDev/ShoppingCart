import { RouterModule, Routes } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { AuthGuard } from '../auth/auth.guard';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeResolverService } from './recipe-resolver.service';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: RecipeStartComponent, pathMatch: 'full' },
      { path: 'new', component: RecipeEditComponent },
      {
        path: ':index',
        component: RecipeDetailComponent,
        resolve: [RecipeResolverService],
      },
      {
        path: ':index/edit',
        component: RecipeEditComponent,
        resolve: [RecipeResolverService],
      },
    ],
  },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class RecipesRoutingModule {}
