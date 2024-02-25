"use client";

import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {FcGoogle} from "react-icons/fc";
import {useEdgeStore} from "@lib/edgestore";
import "@styles/Register.scss";

const Register = () => {
    const {edgestore} = useEdgeStore();
    const router = useRouter();

    const [file, setFile] = useState();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPasword: "",
        profileImage: null,
    });
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(true);

    useEffect(() => {
        setPasswordMatch(formData.password === formData.confirmPasword);
    }, [formData.password, formData.confirmPasword]);

    const handlePasswordValidation = () => {
        if (formData.password.length < 6) {
            setPasswordError("The password must be at least 6 characters long");
        } else {
            setPasswordError("");
        }
    };

    const handleConfirmPasswordValidation = () => {
        if (formData.password !== formData.confirmPasword) {
            setConfirmPasswordError("Passwords do not match");
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        if (files) {
            setFile(files[0]);
        }
        setFormData({...formData, [name]: name === "profileImage" ? files[0] : value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = null;
            if (file) {
                const res = await edgestore.publicFiles.upload({file});
                imageUrl = res.url;
            }

            const updatedFormData = {...formData, profileImage: imageUrl};
            const registerForm = new FormData();
            for (const key in updatedFormData) {
                registerForm.append(key, updatedFormData[key]);
            }

            const response = await fetch("/api/register/", {
                method: "POST",
                body: registerForm,
            });

            if (response.ok) {
                router.push("/login");
            }
        } catch (err) {
            console.log("Registration failed", err.message);
        }
    };

    const loginWithGoogle = () => {
        signIn("google", {callbackUrl: "/"});
    };

    return (
        <div className='register'>
            <img src='/assets/register.jpg' alt='register' className='register_decor' />
            <div className='register_content'>
                <form className='register_content_form' onSubmit={handleSubmit}>
                    <input
                        placeholder='Username'
                        name='username'
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        placeholder='Email'
                        name='email'
                        type='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        placeholder='Password'
                        name='password'
                        type='password'
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handlePasswordValidation}
                        required
                    />
                    {passwordError && <p style={{color: "red"}}>{passwordError}</p>}
                    <input
                        placeholder='Confirm Password'
                        name='confirmPasword'
                        type='password'
                        value={formData.confirmPasword}
                        onChange={handleChange}
                        onBlur={handleConfirmPasswordValidation}
                        required
                    />
                    {confirmPasswordError && <p style={{color: "red"}}>{confirmPasswordError}</p>}
                    <input
                        id='image'
                        type='file'
                        name='profileImage'
                        onChange={handleChange}
                        accept='image/*'
                        style={{display: "none"}}
                        required
                    />
                    <label htmlFor='image'>
                        <img src='/assets/addImage.png' alt='addImage' />
                        <p>Upload Profile Photo</p>
                    </label>
                    {formData.profileImage && (
                        <img
                            src={URL.createObjectURL(formData.profileImage)}
                            alt='Profile'
                            style={{width: "80px", height: "80px", borderRadius: "50%"}}
                        />
                    )}
                    <button type='submit' disabled={!passwordMatch || passwordError}>
                        Register
                    </button>
                </form>
                <button type='button' className='google' onClick={loginWithGoogle}>
                    <p>Log In with Google</p>
                    <FcGoogle />
                </button>
                <a href='/login'>Already have an account? Log In Here</a>
            </div>
        </div>
    );
};
export default Register;
