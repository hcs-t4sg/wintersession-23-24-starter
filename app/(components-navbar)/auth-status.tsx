"use client";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { useAuthContext } from "../(context)/providers";
import UserNav from "./user-nav";

export default function AuthStatus() {
  const { user } = useAuthContext();

  const handleSignIn = () => {
    void signInWithGoogle();
  };

  if (user === "loading") {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Button onClick={handleSignIn}>Log in</Button>;
  }
  return <UserNav user={user} />;
}
