import { http, HttpResponse } from 'msw';
import {
  aboutMeFixture,
  profileFixture,
  experienceFixture,
  skillsFixture,
  educationFixture,
  languagesFixture,
} from './about.fixtures';

export const aboutHandlers = [
  http.get('*/api/v1/about', () =>
    HttpResponse.json(aboutMeFixture)
  ),
  http.get('*/api/v1/about/profile', () =>
    HttpResponse.json(profileFixture)
  ),
  http.get('*/api/v1/about/experience', () =>
    HttpResponse.json(experienceFixture)
  ),
  http.get('*/api/v1/about/skills', () =>
    HttpResponse.json(skillsFixture)
  ),
  http.get('*/api/v1/about/education', () =>
    HttpResponse.json(educationFixture)
  ),
  http.get('*/api/v1/about/languages', () =>
    HttpResponse.json(languagesFixture)
  ),
];