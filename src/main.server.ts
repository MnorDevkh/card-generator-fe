import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;

export const prerender = {
  routes: {
    'card-generator/:id': getCardGeneratorParams,
    'student-info/:id': getStudentInfoParams
  }
};

function getCardGeneratorParams() {
  // Replace with your actual IDs or fetch from DB
  return [{ id: '1' }, { id: '2' }];
}

function getStudentInfoParams() {
  // Replace with your actual IDs or fetch from DB
  return [{ id: '1' }, { id: '2' }];
}