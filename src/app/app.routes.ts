import { Routes } from '@angular/router';
import { HomeComponent } from './component/home.component';
import { CardGeneratorComponent } from './component/card-generator.component';
import { MenuComponent } from './component/menu.component';
import { CardTemplateListComponent } from './component/card-template-list.component';
import { UploadImageComponent } from './component/add-card-template.component';
import { StudentListComponent } from './component/student-list.component';
import { StudentInfo } from './component/student-info/student-info';
import { StudentLookup } from './component/student-lookup/student-lookup';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'card-generator/:id', component: CardGeneratorComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'card-template', component: CardTemplateListComponent },
  { path: 'upload-template', component: UploadImageComponent },
  { path: 'student-list', component: StudentListComponent },
  { path: 'student-info/:id', component: StudentInfo },
  { path: 'students/:id', component: StudentLookup,},
];
