import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
  profiles, // Added import
  user_roles, // Added import
  user_role_enum, // Added import
} from "@/server/db/schema";
import { eq } from "drizzle-orm"; // Added import

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      fullName?: string | null;
      avatarUrl?: string | null;
      email?: string | null; // Already in DefaultSession["user"] but good to be explicit
      role?: string | null; // Using string for simplicity, can be user_role_enum
    } & DefaultSession["user"];
  }

  interface User { // Added User interface augmentation
    id: string;
    fullName?: string | null;
    avatarUrl?: string | null;
    role?: string | null;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    DiscordProvider,
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    jwt: async ({ token, user, account, isNewUser }) => {
      if (user?.id) {
        token.id = user.id;

        // On sign-in or new user creation, try to fetch or create profile and role
        const existingProfile = await db.query.profiles.findFirst({
          where: eq(profiles.id, user.id),
        });

        let userRoleEntry = await db.query.user_roles.findFirst({
          where: eq(user_roles.userId, user.id),
        });

        if (existingProfile) {
          token.fullName = existingProfile.fullName;
          token.avatarUrl = existingProfile.avatarUrl;
          token.role = userRoleEntry ? userRoleEntry.role : null;
          // Ensure email is on the token if it exists on the user object (it should)
          if (user.email) token.email = user.email;


        } else {
          // New user, create profile and assign default role
          // The `user` object from NextAuth (after provider sign-in) should have name, email, image.
          // These might be null depending on the provider and user's privacy settings.
          token.fullName = user.name ?? null; // Use user.name from provider
          token.avatarUrl = user.image ?? null; // Use user.image from provider
          if (user.email) token.email = user.email;


          await db.insert(profiles).values({
            id: user.id,
            fullName: user.name ?? null,
            email: user.email ?? null, // profiles.email is nullable
            avatarUrl: user.image ?? null,
          }).onConflictDoNothing(); // In case of a race condition or if adapter runs first

          // Assign a default role, e.g., 'viewer'
          // Assuming 'viewer' is a valid value in your user_role_enum
          const defaultRole = user_role_enum.enumValues.includes('viewer') ? 'viewer' : user_role_enum.enumValues[0];
          if (defaultRole) {
            await db.insert(user_roles).values({
              userId: user.id,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              role: defaultRole as any, // Cast to any if type mismatch with pgEnum
            }).onConflictDoNothing(); // In case of a race condition
            token.role = defaultRole;
          } else {
            token.role = null; // No default role could be assigned
          }
        }
      }
      return token;
    },
    session: ({ session, token }) => { // token parameter comes from the jwt callback
      session.user.id = token.id as string;
      session.user.role = token.role as string | null;
      session.user.fullName = token.fullName as string | null;
      session.user.avatarUrl = token.avatarUrl as string | null;
      if (token.email) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

[end of src/server/auth/config.ts]
