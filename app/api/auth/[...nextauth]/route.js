import User from "@models/User";
import { connectToDB } from "@mongodb/database";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials, req) {
                await connectToDB();

                const { email, password } = credentials;

                // Check if the user exists
                const user = await User.findOne({ email: email });
                if (!user) {
                    throw new Error("Invalid Email or Password");
                }
                // Compare password
                const isMatch = await compare(password, user.password);

                if (!isMatch) {
                    throw new Error("Invalid Email or Password");
                }

                return user;
            },
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async session({ session }) {
            const sessionUser = await User.findOne({
                email: session.user.email,
            });
            session.user.id = sessionUser._id.toString();
            return session;
        },
        async signIn({ account, profile }) {
            if (account.provider === "google") {
                try {
                    await connectToDB();
                    //Check is the user exist
                    let user = await User.findOne({ email: profile.email });

                    if (!user) {
                        user = await User.create({
                            email: profile.email,
                            username: profile.name,
                            profileImagePath: profile.picture,
                            wishlist: [],
                            cart: [],
                            order: [],
                            work: [],
                        });
                    }
                    return user;
                } catch (err) {
                    console.log("Error cheking if user exist:", err.message);
                }
            }
            return true; // Do different verification for other providers that don't have `email_verified`
        },
    },
});

export { handler as GET, handler as POST };
