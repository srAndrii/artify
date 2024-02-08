"use client";
import Form from "@components/Form";
import Navbar from "@components/Navbar";
import {useEdgeStore} from "@lib/edgestore";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useState} from "react";

const CreateWork = () => {
    const [loading, setLoading] = useState(false);

    const {data: session} = useSession();
    const {edgestore} = useEdgeStore();

    const router = useRouter();

    const [work, setWork] = useState({
        creator: "",
        category: "",
        title: "",
        description: "",
        price: "",
        photos: [],
    });

    if (session) {
        work.creator = session?.user?._id;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const photoUrls = [];

            // Upload each photo and collect the URLs
            for (const photo of work.photos) {
                const res = await edgestore.publicFiles.upload({file: photo});
                photoUrls.push(res.url);
            }

            // Update the work object with the photo URLs
            const updatedWork = {...work, photos: photoUrls};

            const newWorkForm = new FormData();

            for (const key in updatedWork) {
                if (key === "photos") {
                    updatedWork[key].forEach((photoUrl, index) => {
                        newWorkForm.append("photos", photoUrl);
                    });
                } else {
                    newWorkForm.append(key, updatedWork[key]);
                }
            }

            const response = await fetch("/api/work/new", {
                method: "POST",
                body: newWorkForm,
            });
            console.log(newWorkForm);
            setLoading(false);
            if (response.ok) {
                router.push(`/shop?id=${session?.user?._id}`);
            }
        } catch (err) {
            console.log("Publish Work failed", err.message);
        }
    };

    return (
        <>
            <Navbar />
            <Form
                type='Create'
                work={work}
                setWork={setWork}
                handleSubmit={handleSubmit}
                loading={loading}
            />
        </>
    );
};
export default CreateWork;
