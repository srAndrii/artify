"use client";

import Form from "@components/Form";
import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
import {useEdgeStore} from "@lib/edgestore";
import {useSession} from "next-auth/react";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";

const UpdateWork = () => {
    const {data: session} = useSession();
    const [loading, setLoading] = useState(true);
    const [btnLoadinbg, setBtnLoadinbg] = useState(false);

    const {edgestore} = useEdgeStore();

    const searchParams = useSearchParams();
    const workId = searchParams.get("id");

    const [work, setWork] = useState({
        category: "",
        title: "",
        description: "",
        price: "",
        photos: [],
    });

    useEffect(() => {
        const getWorkDetails = async () => {
            const response = await fetch(`api/work/${workId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            setWork({
                category: data.category,
                title: data.title,
                description: data.description,
                price: data.price,
                photos: data.workPhotoPaths,
            });

            setLoading(false);
        };

        if (workId) {
            getWorkDetails();
        }
    }, [workId]);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        toast.promise(
            (async () => {
                setBtnLoadinbg(true);
                const updatedWork = {...work, photos: []};

                for (const photo of work.photos) {
                    if (typeof photo === "string") {
                        updatedWork.photos.push(photo);
                    } else {
                        const res = await edgestore.publicFiles.upload({
                            file: photo,
                        });
                        updatedWork.photos.push(res.url);
                    }
                }

                const updateFormWork = new FormData();

                for (var key in updatedWork) {
                    if (key === "photos") {
                        updatedWork[key].forEach((photoUrl, index) => {
                            updateFormWork.append("photos", photoUrl);
                        });
                    } else {
                        updateFormWork.append(key, updatedWork[key]);
                    }
                }

                const response = await fetch(`api/work/${workId}`, {
                    method: "PATCH",
                    body: updateFormWork,
                });

                setBtnLoadinbg(false);

                if (response.ok) {
                    router.push(`/shop?id=${session?.user?._id}`);
                }
            })(),
            {
                loading: "Saving...",
                success: <b>Work updated successfully!</b>,
                error: <b>Could not save. Please try again.</b>,
            }
        );
    };

    return loading ? (
        <Loader />
    ) : (
        <>
            <Navbar />
            <Form
                type='Edit'
                work={work}
                setWork={setWork}
                handleSubmit={handleSubmit}
                loading={btnLoadinbg}
            />
        </>
    );
};
export default UpdateWork;
