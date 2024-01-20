"use client";

import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
import WorkList from "@components/WorkList";
import {useSession} from "next-auth/react";
import {useSearchParams} from "next/navigation";
import {use, useEffect, useState} from "react";
import "@styles/Shop.scss";

const Shop = () => {
    const [loading, setLoading] = useState(true);

    const {data: session} = useSession();
    const loggedInUserId = session?.user?._id;

    const searchParams = useSearchParams();
    const profileId = searchParams.get("id");

    const [workList, setWorkList] = useState([]);
    const [user, setUser] = useState({});

    useEffect(() => {
        const getWorkList = async () => {
            const response = await fetch(`api/user/${loggedInUserId}/shop`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setWorkList(data.workList);
            setUser(data.user);
            setLoading(false);
        };

        if (loggedInUserId) {
            getWorkList();
        }
    }, [loggedInUserId]);

    return loading ? (
        <Loader />
    ) : (
        <>
            <Navbar />

            {loggedInUserId && <h1 className='title-list'>Your Works</h1>}

            {/* {loggedInUserId !== profileId && (
                <h1 className='title-list'>{profile.username}'s Works</h1>
            )} */}

            <WorkList data={workList} />
        </>
    );
};

export default Shop;
