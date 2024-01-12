"useClient";
import "@styles/Register.scss";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
    return (
        <div className="register">
            <img
                src="/assets/register.jpg"
                alt="register"
                className="register_decor"
            />
            <div className="register_content">
                <form className="register_content_form">
                    <input placeholder="Username" name="username" required />
                    <input placeholder="Email" name="email" required />
                    <input placeholder="Password" name="password" required />
                    <input
                        placeholder="Confirm Password"
                        name="confirmPasword"
                        required
                    />
                    <input
                        id="image"
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        style={{ display: "none" }}
                        required
                    />
                    <label htmlFor="image">
                        <img src="/assets/addImage.png" alt="addImage" />
                        <p>Upload Profile Photo</p>
                    </label>
                    <button type="submit">Register</button>
                </form>
                <button type="button" className="google">
                    <p>Log In with Google</p>
                    <FcGoogle />
                </button>
                <a href="/login">Alredy have an account? Log In Here</a>
            </div>
        </div>
    );
};
export default Register;
