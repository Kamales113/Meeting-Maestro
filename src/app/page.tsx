
"use client";
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
import { useRouter } from "next/navigation";
import { useAuth, useUser, initiateEmailSignIn } from "@/firebase";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use the non-blocking sign-in function.
      // It will sign in or create an account.
      initiateEmailSignIn(auth, email, password);
      
      // We don't need to await here. The onAuthStateChanged listener
      // in the Firebase provider will handle the redirect.
      
    } catch (error: any) {
      // This catch block might not even be necessary with the non-blocking approach
      // but we'll leave it for any synchronous errors.
      console.error("Login initiation error:", error);
      toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your login request.",
      });
    } 

    // Because we're not awaiting, we can't reliably set submitting to false here
    // based on the operation's completion. The redirect will handle the UI change.
    // If there's an error caught by the listener, the UI can be updated then.
    // For this app, we'll just let the redirect take over.
  };

  useEffect(() => {
    // This effect will run when the `user` object changes,
    // handling the redirect after successful login/signup.
    if (!isUserLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isUserLoading, router]);

   // This effect will catch and display authentication errors from the provider
   useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
        (user) => {},
        (error) => {
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
                 toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: "Invalid email or password. Please try again.",
                });
            } else if (error.code === 'auth/weak-password') {
                 toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: "Password should be at least 6 characters.",
                });
            } else {
                 console.error("Firebase auth state error:", error);
                 toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: error.message || "An unexpected error occurred.",
                });
            }
            setIsSubmitting(false);
        }
    );
    return () => unsubscribe();
   }, [auth, toast]);


  if (isUserLoading || user) {
    // Show a blank screen while loading or redirecting to avoid flashing the login page.
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email to sign in or create your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In / Sign Up'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
