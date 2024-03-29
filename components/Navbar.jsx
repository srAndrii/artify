"use client";

import {Menu, Person, Search, ShoppingCart} from "@mui/icons-material";
import {IconButton} from "@mui/material";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {useState} from "react";
import "@styles/Navbar.scss";
import {useRouter} from "next/navigation";

const Navbar = () => {
    const {data: session} = useSession();
    const user = session?.user;

    const [dropdownMenu, setDropdownMenu] = useState(false);

    const handleLogout = async () => {
        signOut({callbackUrl: "/"});
    };

    const [query, setQuery] = useState("");

    const router = useRouter();
    const searchWork = async () => {
        router.push(`/search/${query}`);
    };

    const cart = user?.cart;

    return (
        <div className='navbar'>
            <a href='/'>
                <img src='/assets/logo.png' alt='logo' />
            </a>
            <div className='navbar_search'>
                <input
                    type='text'
                    placeholder='Search...'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <IconButton disabled={query === ""} onClick={searchWork}>
                    <Search sx={{color: "red"}} />
                </IconButton>
            </div>
            <div className='navbar_right'>
                <a href='/cart' className='cart'>
                    <ShoppingCart sx={{color: "gray"}} />
                    Cart <span>({cart?.length})</span>
                </a>
                <button
                    className='navbar_right_account'
                    onClick={() => setDropdownMenu(!dropdownMenu)}
                >
                    <Menu sx={{color: "gray"}} />
                    {!user ? (
                        <Person sx={{color: "gray"}} />
                    ) : (
                        <img
                            src={user.profileImagePath}
                            alt='profile'
                            style={{
                                objectFit: "cover",
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                            }}
                            referrerPolicy='no-referrer'
                        />
                    )}
                </button>
                {dropdownMenu && !user && (
                    <div className='navbar_right_accountmenu'>
                        <Link href='/login'>Log In</Link>
                        <Link href='/register'>Sign Up</Link>
                    </div>
                )}
                {dropdownMenu && user && (
                    <div className='navbar_right_accountmenu'>
                        <Link href='/wishlist'>Wishlist</Link>
                        <Link href='/cart'>Cart</Link>
                        <Link href='/order'>Orders</Link>
                        <Link href={`/shop?id=${user._id}`}>Your Shop</Link>
                        <Link href='/create-work'>Sell Your Work</Link>
                        <a onClick={handleLogout}>Log Out</a>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Navbar;
