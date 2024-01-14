import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        unique: [true, "Username  alredy exist"],
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        unique: [true, "Email  alredy exist"],
        required: [true, "Email is required"],
    },
    password: {
        type: String,
    },
    profileImagePath: {
        type: String,
        required: [true, "Profile image is required"],
    },
    wishlist: {
        type: Array,
        default: [],
    },
    cart: {
        type: Array,
        default: [],
    },
    order: {
        type: Array,
        default: [],
    },
    work: {
        type: Array,
        default: [],
    },
});

const User = models.User || model("User", UserSchema);

export default User;
