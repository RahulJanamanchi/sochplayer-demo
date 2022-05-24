import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TracksComponent } from './components/tracks/tracks.component';

const routes: Routes = [
  { path: '', component: TracksComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
