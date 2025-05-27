
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
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
import { UserPlus, Loader2, AlertCircle, KeyRound, UserCircle2, LogIn } from "lucide-react";
import { registerUser, type RegisterState } from "./actions";


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
          Creating account...
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Register
        </>
      )}
    </Button>
  );
}


export default function RegisterPage() {
  const { toast } = useToast();
  const initialState: RegisterState = { message: null, error: null, success: false };
  const [formState, formAction] = useFormState(registerUser, initialState);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (formState?.success && formState.message) {
      toast({
        title: "Registration Successful!",
        description: formState.message,
        variant: "default",
      });
      // Clear form fields on success
      setDisplayName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      // Optionally redirect or reset form state further
    } else if (formState?.error) {
      toast({
        title: "Registration Error",
        description: formState.error,
        variant: "destructive",
      });
    }
  }, [formState, toast]);

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <UserPlus className="mx-auto h-12 w-auto text-primary" />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
          Create your BlockArmor account
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Or{" "}
          <Link href="/login" legacyBehavior>
            <a className="font-medium text-primary hover:text-primary/90">
              sign in if you have an account
            </a>
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-xl">
          <form action={formAction}>
            <CardHeader>
              <CardTitle className="text-xl">Register</CardTitle>
              <CardDescription>
                Fill in the details below to create your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">
                  <UserCircle2 className="inline-block mr-2 h-4 w-4 relative -top-px" />
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  <UserPlus className="inline-block mr-2 h-4 w-4 relative -top-px" />
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
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  <KeyRound className="inline-block mr-2 h-4 w-4 relative -top-px" />
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
              </div>

              {formState?.error && !formState.success && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Registration Error</AlertTitle>
                  <AlertDescription>{formState.error}</AlertDescription>
                </Alert>
              )}
               {formState?.success && formState.message && (
                <Alert variant="default" className="bg-green-50 border-green-300 text-green-700">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertTitle className="text-green-700">Registration Successful</AlertTitle>
                  <AlertDescription>
                    {formState.message}
                  </AlertDescription>
                </Alert>
            )}
            </CardContent>
            <CardFooter className="flex flex-col items-stretch space-y-4">
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>
         <p className="mt-8 text-center text-xs text-muted-foreground">
            By creating an account, you agree to our (non-existent)
            <Link href="/terms" legacyBehavior><a className="underline hover:text-primary px-1">Terms of Service</a></Link>
            and
            <Link href="/privacy" legacyBehavior><a className="underline hover:text-primary pl-1">Privacy Policy</a></Link>.
          </p>
      </div>
    </div>
  );
}
