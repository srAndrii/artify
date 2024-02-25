import {ArrowBackIosNew, ArrowForwardIos, Delete, Favorite, FavoriteBorder} from "@mui/icons-material";
import "@styles/WorkCard.scss";
import {useSession} from "next-auth/react";

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";

const WorkCard = ({work}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const [loadedImages, setLoadedImages] = useState([0]); // Preload the first two images initially

    const loadAllImages = () => {
        setLoadedImages(work.workPhotoPaths.map((_, index) => index)); // Load all images
    };

    const goToNextSlide = () => {
        setCurrentIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % work.workPhotoPaths.length;
            if (newIndex === 1) {
                // Load all images when moving from the first to the second image
                loadAllImages();
            }
            return newIndex;
        });
    };

    const goToPrevSlide = () => {
        setCurrentIndex((prevIndex) => {
            const newIndex = (prevIndex - 1 + work.workPhotoPaths.length) % work.workPhotoPaths.length;
            return newIndex;
        });
    };

    const router = useRouter();

    const PreloadedImage = ({src, alt, ...props}) => {
        const [currentSrc, setCurrentSrc] = useState(null);

        useEffect(() => {
            const img = new Image();
            img.onload = () => setCurrentSrc(src); // Update current image when the new image is loaded
            img.src = src;
        }, [src]);

        return currentSrc ? <img src={currentSrc} alt={alt} {...props} /> : null;
    };

    // DELETE WORK
    const handleDelete = () => {
        toast(
            (t) => (
                <div style={{display: "flex", flexDirection: "column"}}>
                    <p>Are you sure you want to delete this work?</p>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "10px",
                        }}
                    >
                        <button
                            onClick={async () => {
                                try {
                                    await fetch(`api/work/${work._id}`, {
                                        method: "DELETE",
                                    });
                                    toast.dismiss(t.id);
                                    window.location.reload();
                                } catch (err) {
                                    console.log(err);
                                    toast.error("Error deleting work");
                                }
                            }}
                            style={{
                                backgroundColor: "#f44336",
                                color: "white",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                marginRight: "8px",
                            }}
                        >
                            Yes, delete it
                        </button>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            style={{
                                backgroundColor: "gray",
                                color: "white",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ),
            {
                duration: 4000,
            }
        );
    };

    const {data: session, update} = useSession();
    const userId = session?.user?._id;

    //ADD TO WISHLIST
    const wishlist = session?.user?.wishlist;

    const isLiked = wishlist?.find((item) => item?._id === work._id);

    const patchWishlist = async () => {
        const response = await fetch(`api/user/${userId}/wishlist/${work._id}`, {
            method: "PATCH",
        });
        const data = await response.json();
        update({user: {wishlist: data.wishlist}}); // update session
    };

    return (
        <div
            className='work-card'
            onClick={() => {
                router.push(`/work-details?id=${work._id}`);
            }}
        >
            <div className='slider-container'>
                <div className='slider' style={{transform: `translateX(-${currentIndex * 100}%)`}}>
                    {work.workPhotoPaths.map((photo, index) => (
                        <div className='slide' key={index}>
                            {loadedImages.includes(index) ? <PreloadedImage src={photo} alt='Work Card Photo' /> : null}
                            <div
                                className='prev-button'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrevSlide();
                                }}
                            >
                                <ArrowBackIosNew sx={{fontSize: "15px"}} />
                            </div>
                            <div
                                className='next-button'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNextSlide();
                                }}
                            >
                                <ArrowForwardIos sx={{fontSize: "15px"}} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='info'>
                <div>
                    <h3>{work.title}</h3>
                    <div className='creator'>
                        <img
                            src={work.creator.profileImagePath}
                            alt='creator'
                            referrerPolicy='no-referrer'
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/shop?id=${work.creator._id}`);
                            }}
                        />
                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/shop?id=${work.creator._id}`);
                            }}
                        >
                            {work.creator.username}
                        </span>
                        in
                        <span>{work.category}</span>
                    </div>
                </div>
                <div className='price'> ${work.price} </div>
            </div>
            {userId === work?.creator._id ? (
                <div
                    className='icon'
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                    }}
                >
                    <Delete
                        sx={{
                            borderRadius: "50%",
                            backgroundColor: "white",
                            padding: "5px",
                            fontSize: "30px",
                        }}
                    />
                </div>
            ) : (
                <div
                    className='icon'
                    onClick={(e) => {
                        e.stopPropagation();
                        patchWishlist();
                    }}
                >
                    {isLiked ? (
                        <Favorite
                            sx={{
                                borderRadius: "50%",
                                backgroundColor: "white",
                                color: "red",
                                padding: "5px",
                                fontSize: "30px",
                            }}
                        />
                    ) : (
                        <FavoriteBorder
                            sx={{
                                borderRadius: "50%",
                                backgroundColor: "white",
                                padding: "5px",
                                fontSize: "30px",
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
export default WorkCard;
