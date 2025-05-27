
'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';

const registerSchema = z.object({
  displayName: z.string().min(1, "Display name cannot be empty."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export type RegisterState = {
  message?: string | null;
  error?: string | null;
  success?: boolean;
};

export async function registerUser(
  prevState: RegisterState | undefined,
  formData: FormData
): Promise<RegisterState> {
  const rawFormData = {
    displayName: formData.get('displayName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  if (rawFormData.password !== rawFormData.confirmPassword) {
    return { error: "Passwords do not match.", success: false };
  }

  const validatedFields = registerSchema.safeParse({
    displayName: rawFormData.displayName,
    email: rawFormData.email,
    password: rawFormData.password,
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors ? 
             Object.values(validatedFields.error.flatten().fieldErrors).flat().join(' ') 
             : "Invalid data provided.",
      success: false,
    };
  }

  const { displayName, email, password } = validatedFields.data;
  const defaultTier = 'free'; // Set default tier for new users

  try {
    const db = getDb();

    // Check if user already exists
    const existingUserStmt = db.prepare('SELECT id FROM users WHERE email = ?');
    const existingUser = existingUserStmt.get(email);

    if (existingUser) {
      return { error: 'User with this email already exists.', success: false };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const insertStmt = db.prepare(
      'INSERT INTO users (displayName, email, hashedPassword, tier) VALUES (?, ?, ?, ?)'
    );
    const info = insertStmt.run(displayName, email, hashedPassword, defaultTier);

    if (info.changes > 0) {
      return { message: `Welcome, ${displayName}! Your account has been created with a '${defaultTier}' tier. You can now try to log in (login functionality not yet implemented).`, success: true };
    } else {
      return { error: 'Failed to create account. Please try again.', success: false };
    }
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error && (error as any).code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { error: 'User with this email already exists.', success: false };
    }
    return { error: 'An unexpected error occurred during registration.', success: false };
  }
}
