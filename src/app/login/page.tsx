
"use client";

import { useEffect, useState, useActionState } from "react"; // Changed import for useActionState
import Link from "next/link";
import { useFormStatus } from "react-dom"; 
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Loader2, AlertCircle, KeyRound, UserCircle2, UserPlus } from "lucide-react";
import { loginUser, type LoginState } from "./actions";
// import { useRouter } from 'next/navigation'; // Uncomment if implementing redirect

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </>
      )}
    </Button>
  );
}

export default function LoginPage() {
  const { toast } = useToast();
  // const router = useRouter(); // Uncomment if implementing redirect
  const initialState: LoginState = { message: null, error: null, success: false, redirectTo: null };
  // useActionState is imported from 'react' for form actions with Server Actions.
  const [formState, formAction] = useActionState(loginUser, initialState);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (formState?.success && formState.message) {
      toast({
        title: "Login Successful!",
        description: formState.message,
        variant: "default",
      });
      // Clear form fields on success
      setEmail("");
      setPassword("");
      // if (formState.redirectTo) {
      //   router.push(formState.redirectTo);
      // }
    } else if (formState?.error) {
      toast({
        title: "Login Error",
        description: formState.error,
        variant: "destructive",
      });
    }
  }, [formState, toast /*, router */]); // Add router if using redirect

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <LogIn className="mx-auto h-12 w-auto text-primary" />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
          Sign in to BlockArmor
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Or{" "}
          <Link href="/register" legacyBehavior>
            <a className="font-medium text-primary hover:text-primary/90">
              create an account if you don&apos;t have one
            </a>
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-xl">
          <form action={formAction}>
            <CardHeader>
              <CardTitle className="text-xl">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <UserCircle2 className="inline-block mr-2 h-4 w-4 relative -top-px" />
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  <KeyRound className="inline-block mr-2 h-4 w-4 relative -top-px" />
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              {formState?.error && !formState.success && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Login Error</AlertTitle>
                  <AlertDescription>{formState.error}</AlertDescription>
                </Alert>
              )}
               {formState?.success && formState.message && (
                <Alert variant="default" className="border-green-300 text-green-700 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700">
                  <LogIn className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-700 dark:text-green-300">Login Successful</AlertTitle>
                  <AlertDescription>
                    {formState.message}
                  </AlertDescription>
                </Alert>
            )}
            </CardContent>
            <CardFooter className="flex flex-col items-stretch space-y-4">
              <SubmitButton />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href="/register">
                  <UserPlus className="mr-2 h-4 w-4" /> Create new account
                </Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
         <p className="mt-8 text-center text-xs text-muted-foreground">
            <Link href="/dashboard" legacyBehavior><a className="underline hover:text-primary px-1">Return to Dashboard</a></Link>
          </p>
      </div>
    </div>
  );
}
