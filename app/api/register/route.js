import {connectToDB} from "@mongodb/database";
import User from "@models/User";
import {NextResponse} from "next/server";
import {hash} from "bcryptjs";

// User Register
export async function POST(req) {
    try {
        await connectToDB();

        const data = await req.formData();

        // Take information from the form
        const username = data.get("username");
        const email = data.get("email");
        const password = data.get("password");
        const file = data.get("profileImage");

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return NextResponse.json(
                {message: "User alredy exist!"},
                {status: 409}
            );
        }

        // Hash the pasword
        const saltRound = 10;
        const hashedPasword = await hash(password, saltRound);

        // Create a New User
        const newUser = new User({
            username,
            email,
            password: hashedPasword,
            profileImagePath: file,
        });

        //Save newUser
        await newUser.save();

        // Send success message
        return NextResponse.json(
            {message: "User registred successfuly!", user: newUser},
            {status: 200}
        );
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            {message: "Fail to create new User"},
            {status: 500}
        );
    }
}
