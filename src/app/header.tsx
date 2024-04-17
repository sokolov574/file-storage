import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignInButton, SignedOut, UserButton, UserProfile } from "@clerk/nextjs";
import Image from "next/image";

export function Header() {
    return <div className="border-b py-4 bg-gray-50">
             <div className="items center container mx-auto justify-between flex">
                <div>
                    <Image src="/logo.png" width="80" height="80" alt="file storage logo"/>
                 FileStorage</div>
                  <div className="flex gap-2"/>
            <OrganizationSwitcher />
            <UserButton />
           
                <SignedOut> 
                    <SignInButton>
                        <Button>Sign In</Button>
                    </SignInButton>
                </SignedOut>
        
            
        </div>
    </div>
}

// This is the Header component. It includes the OrganizationSwitcher and UserButton components.
// When the user is signed out, the SignInButton is displayed.




