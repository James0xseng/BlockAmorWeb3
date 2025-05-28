
'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import type { RedirectError } from 'next/dist/client/components/redirect';

const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password cannot be empty."),
});

export type LoginState = {
  message?: string | null;
  error?: string | null;
  success?: boolean;
  redirectTo?: string | null;
};

export async function loginUser(
  prevState: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const rawFormData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validatedFields = loginSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors
        ? Object.values(validatedFields.error.flatten().fieldErrors).flat().join(' ')
        : "Invalid data provided.",
      success: false,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const db = getDb();
    const stmt = db.prepare('SELECT id, displayName, hashedPassword, tier FROM users WHERE email = ?');
    const user = stmt.get(email) as { id: number; displayName: string; hashedPassword: string, tier: string } | undefined;

    if (!user) {
      return { error: 'Invalid email or password.', success: false };
    }

    const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordsMatch) {
      return { error: 'Invalid email or password.', success: false };
    }

    // IMPORTANT: This is where you would typically set up a user session (e.g., using cookies, JWTs with next-auth or a similar library).
    // For this example, we're just returning a success message and a displayName.
    // In a real app, you'd redirect after setting the session.
    console.log(`User ${user.displayName} (Tier: ${user.tier}) logged in successfully. Session management not yet implemented.`);
    
    return { 
      message: `Login successful! Welcome back, ${user.displayName}. (Session management not yet implemented)`, 
      success: true,
      // redirectTo: '/dashboard' // Example redirect path after successful login and session setup
    };

  } catch (error) {
    // Type guard for RedirectError if you were using next/navigation's redirect
    if ((error as RedirectError)?.message?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Login error:', error);
    return { error: 'An unexpected error occurred during login.', success: false };
  }
}
