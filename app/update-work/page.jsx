"use client";

import Form from "@components/Form";
import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
import {useEdgeStore} from "@lib/edgestore";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";

const UpdateWork = () => {
    const [loading, setLoading] = useState(true);
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
    console.log(work);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedWork = {...work, photos: []};

            for (const photo of work.photos) {
                if (typeof photo === "string") {
                    // Якщо це вже посилання, просто додаємо його до масиву
                    updatedWork.photos.push(photo);
                } else {
                    // Якщо це файл, завантажте його і додайте посилання на сервер
                    const res = await edgestore.publicFiles.upload({
                        file: photo,
                    });
                    updatedWork.photos.push(res.url);
                }
            }

            console.log(work);

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

            if (response.ok) {
                router.push(`/`);
            }
        } catch (err) {
            console.log("Publish Work failed", err.message);
        }
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
            />
        </>
    );
};
export default UpdateWork;
