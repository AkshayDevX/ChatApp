import { createFileRoute, redirect } from '@tanstack/react-router'
import Register from '../pages/auth/register'
import isAuthenticated from '../utils/authenticated';

export const Route = createFileRoute('/register')({
  beforeLoad: async () => {
    if (isAuthenticated()) {
      throw redirect({ to: "/home" });
    }
  },
  component: Register
})