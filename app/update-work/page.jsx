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
    const {edgestore} = useEdgeStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const workId = searchParams.get("id");

    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [work, setWork] = useState({
        category: "",
        title: "",
        description: "",
        price: "",
        photos: [],
    });

    useEffect(() => {
        const getWorkDetails = async () => {
            if (workId) {
                try {
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
                } catch (err) {
                    console.log(err);
                } finally {
                    setLoading(false);
                }
            }
        };
        getWorkDetails();
    }, [workId]);

    const validateInput = (name, value) => {
        if (!value.trim()) {
            setErrors((prev) => ({...prev, [name]: "This field cannot be empty!"}));
        } else {
            setErrors((prev) => {
                const newState = {...prev};
                delete newState[name];
                return newState;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {
            category: !work.category && "Please select a category!",
            photos: !work.photos.length && "Please add at least one photo!",
            formErrors: Object.keys(errors).length > 0 && "Please correct the errors in the form!",
        };

        const firstError = Object.values(validationErrors).find((msg) => msg);
        if (firstError) {
            toast.error(firstError);
            return;
        }

        toast
            .promise(
                (async () => {
                    setBtnLoading(true);
                    const updatedWork = {...work, photos: []};

                    for (const photo of work.photos) {
                        if (typeof photo === "string") {
                            updatedWork.photos.push(photo);
                        } else {
                            const res = await edgestore.publicFiles.upload({file: photo});
                            updatedWork.photos.push(res.url);
                        }
                    }

                    const updateFormWork = new FormData();
                    for (const key in updatedWork) {
                        if (key === "photos") {
                            updatedWork[key].forEach((photoUrl) => updateFormWork.append("photos", photoUrl));
                        } else {
                            updateFormWork.append(key, updatedWork[key]);
                        }
                    }

                    const response = await fetch(`api/work/${workId}`, {
                        method: "PATCH",
                        body: updateFormWork,
                    });

                    if (response.ok) {
                        router.push(`/shop?id=${session?.user?._id}`);
                    }
                })(),
                {
                    loading: "Saving...",
                    success: <b>Work updated successfully!</b>,
                    error: <b>Could not save. Please try again.</b>,
                }
            )
            .finally(() => setBtnLoading(false));
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
                loading={btnLoading}
                errors={errors}
                validateInput={validateInput}
            />
        </>
    );
};

export default UpdateWork;
