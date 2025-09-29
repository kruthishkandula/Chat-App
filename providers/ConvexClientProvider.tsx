"use client";

import { LoadingLogo } from "@/components/shared/LoadingLogo";
import { ClerkProvider, useAuth, SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import { AuthLoading, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from 'react';

type Props = {
    children: React.ReactNode;
}

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
const convex = new ConvexReactClient(CONVEX_URL);

const ConvexClientProvider = ({ children }: Props) => {
    return (
        <ClerkProvider publishableKey={NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                <AuthLoading>
                    <LoadingLogo />
                </AuthLoading>

                <SignedIn>
                    {children}
                </SignedIn>
                <SignedOut>
                    <div className="flex min-h-screen items-center justify-center">
                        <SignIn />
                    </div>
                </SignedOut>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}

export default ConvexClientProvider