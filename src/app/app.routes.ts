import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home.component';
import { CardGeneratorComponent } from './component/card-generator.component';
import { MenuComponent } from './component/menu.component';
import { CardTemplateListComponent } from './component/card-template-list.component';
import { UploadImageComponent } from './component/add-card-template.component';
import { StudentListComponent } from './component/student-list.component';
import { StudentInfo } from './component/student-info/student-info';
import { StudentLookup } from './component/student-lookup/student-lookup';
import { Login } from './auth/login/login';
import { AuthGuard } from './auth-guard';
import { NgModule } from '@angular/core';

export const routes: Routes = [
 { path: '', component: HomeComponent },
  // Unprotected route for login
  { path: 'login', component: Login },
  // Protected routes using canActivate
  { path: 'card-generator/:id', component: CardGeneratorComponent, canActivate: [AuthGuard] },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  { path: 'card-template', component: CardTemplateListComponent, canActivate: [AuthGuard] },
  { path: 'upload-template', component: UploadImageComponent, canActivate: [AuthGuard] },
  { path: 'student-list', component: StudentListComponent, canActivate: [AuthGuard] },
  { path: 'student-info/:id', component: StudentInfo, canActivate: [AuthGuard] },
  { path: 'students/:id', component: StudentLookup, canActivate: [AuthGuard] },
  // Add a catch-all for unknown routes
  { path: '**', redirectTo: '' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}