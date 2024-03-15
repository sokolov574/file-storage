'use client'

import { Button } from "@/components/ui/button";
import { SignIn, SignInButton, SignOutButton, SignedIn, SignedOut, useSession } from "@clerk/nextjs";

export default function Home() {

  const session = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
      
      
      
      <Button>Hello World</Button>
    </main>
  );
}
