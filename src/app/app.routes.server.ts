import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'card-generator/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'student-info/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'students/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
