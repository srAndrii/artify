"use client";
import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
import {
    ArrowBackIosNew,
    ArrowForwardIos,
    Edit,
    Favorite,
    FavoriteBorder,
    ShoppingCart,
} from "@mui/icons-material";
import "@styles/WorkDetail.scss";
import {useSession} from "next-auth/react";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";

const WorkDetails = () => {
    const [loading, setLoading] = useState(true);
    const [work, setWork] = useState({});

    const searchParams = useSearchParams();
    const workId = searchParams.get("id");

    useEffect(() => {
        const getWorkDetails = async () => {
            const response = await fetch(`api/work/${workId}`, {
                method: "GET",
            });
            const data = await response.json();
            setWork(data);
            setLoading(false);
        };
        if (workId) {
            getWorkDetails();
        }
    }, [workId]);

    const {data: session, update} = useSession();
    const userId = session?.user?._id;

    //Slider for photos

    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNextSlide = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex + 1) % work.workPhotoPaths.length
        );
    };

    const goToPrevSlide = () => {
        setCurrentIndex(
            (prevIndex) =>
                (prevIndex - 1 + work.workPhotoPaths.length) %
                work.workPhotoPaths.length
        );
    };

    // SHOW MORE PHOTOS
    const [visiblePhotos, setVisiblePhotos] = useState(5);

    const loadMorePhotos = () => {
        setVisiblePhotos(work.workPhotoPaths.length);
    };

    // SELECT PHOTO TO SHOW
    const [selectedPhoto, setSelectedPhoto] = useState(0);

    const handleSelectedPhoto = (index) => {
        setSelectedPhoto(index);
        setCurrentIndex(index);
    };

    const router = useRouter();

    /* ADD TO WISHLIST */
    const wishlist = session?.user?.wishlist;

    const isLiked = wishlist?.find((item) => item?._id === work._id);

    const patchWishlist = async () => {
        const response = await fetch(
            `api/user/${userId}/wishlist/${work._id}`,
            {
                method: "PATCH",
            }
        );
        const data = await response.json();
        update({user: {wishlist: data.wishlist}}); // update session
    };

    return loading ? (
        <Loader />
    ) : (
        <>
            <Navbar />
            <div className='work-details'>
                <div className='title'>
                    <h1>{work.title}</h1>
                    {work?.creator?._id === userId ? (
                        <div
                            className='save'
                            onClick={() => {
                                router.push(`update-work?id=${workId}`);
                            }}
                        >
                            <Edit />
                            <p>Edit</p>
                        </div>
                    ) : (
                        <div className='save' onClick={patchWishlist}>
                            {isLiked ? (
                                <Favorite sx={{color: "red"}} />
                            ) : (
                                <FavoriteBorder />
                            )}
                            <p>Save</p>
                        </div>
                    )}
                </div>
                <div className='slider-container'>
                    <div
                        className='slider'
                        style={{
                            transform: `translateX(-${currentIndex * 100}%)`,
                        }}
                    >
                        {work.workPhotoPaths?.map((photo, index) => (
                            <div className='slide'>
                                <img src={photo} alt='Work Card Photo' />
                                <div
                                    className='prev-button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToPrevSlide(e);
                                    }}
                                >
                                    <ArrowBackIosNew sx={{fontSize: "15px"}} />
                                </div>
                                <div
                                    className='next-button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToNextSlide(e);
                                    }}
                                >
                                    <ArrowForwardIos sx={{fontSize: "15px"}} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='photos'>
                    {work.workPhotoPaths
                        ?.slice(0, visiblePhotos)
                        .map((photo, index) => (
                            <img
                                src={photo}
                                alt='work-demo'
                                key={index}
                                onClick={() => handleSelectedPhoto(index)}
                                className={
                                    selectedPhoto === index ? "selected" : ""
                                }
                            />
                        ))}

                    {visiblePhotos < work.workPhotoPaths.length && (
                        <div className='show-more' onClick={loadMorePhotos}>
                            <ArrowForwardIos sx={{fontSize: "40px"}} />
                            Show More
                        </div>
                    )}
                </div>

                <hr />

                <div className='profile'>
                    <img
                        src={work.creator.profileImagePath}
                        alt='profile'
                        onClick={() =>
                            router.push(`/shop?id=${work.creator._id}`)
                        }
                    />
                    <h3>Created by {work.creator.username}</h3>
                </div>

                <hr />

                <h3>About this product</h3>
                <p>{work.description}</p>

                <h1>${work.price}</h1>
                <button type='submit'>
                    <ShoppingCart />
                    ADD TO CART
                </button>
            </div>
        </>
    );
};
export default WorkDetails;
