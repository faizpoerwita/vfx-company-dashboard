import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      onboardingStatus: string;
      email: string;
      name?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    onboardingStatus: string;
    email: string;
    name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    onboardingStatus: string;
    email: string;
    name?: string | null;
  }
}
