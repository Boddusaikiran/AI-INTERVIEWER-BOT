import InterviewSimulator from './pages/InterviewSimulator';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'AI Interview Simulator',
    path: '/',
    element: <InterviewSimulator />
  }
];

export default routes;