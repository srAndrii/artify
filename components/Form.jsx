"use client";
import {categories} from "@data";
import {IoIosImages} from "react-icons/io";
import {BiTrash} from "react-icons/bi";
import "@styles/Form.scss";
import {useEdgeStore} from "@lib/edgestore";
import Button from "./button/Button";
import {useState} from "react";

const Form = ({
    type,
    work,
    setWork,
    loading,
    handleSubmit,
    errors,
    validateInput,
}) => {
    const {edgestore} = useEdgeStore();
    // const [errors, setErrors] = useState({});

    const handleUploadPhotos = (e) => {
        const newPhotos = e.target.files;
        setWork((prevWork) => {
            return {
                ...prevWork,
                photos: [...prevWork.photos, ...newPhotos],
            };
        });
    };

    const handleRemovePhoto = async (indexToRemove) => {
        try {
            const removedPhoto = work.photos[indexToRemove];

            // Check if the photo has a URL property, indicating it's already been uploaded
            if (typeof removedPhoto === "string" || removedPhoto.url) {
                // It's an uploaded photo, so call the server to delete
                await edgestore.publicFiles.delete({
                    url: removedPhoto.url || removedPhoto,
                });
            }

            setWork((prevWork) => ({
                ...prevWork,
                photos: prevWork.photos.filter(
                    (_, index) => index !== indexToRemove
                ),
            }));
        } catch (error) {
            console.error("Error deleting photo:", error.message);
        }
    };
    const handleChange = (e) => {
        const {name, value} = e.target;
        setWork((prevWork) => {
            return {
                ...prevWork,
                [name]: value,
            };
        });
        validateInput(name, value);
    };

    return (
        <div className='form'>
            <h1>{type} Your Work</h1>
            <form onSubmit={handleSubmit}>
                <h3>Which of these categories best describes your work?</h3>
                <div className='category-list'>
                    {categories?.map((item, index) => (
                        <p
                            key={index}
                            onClick={() => {
                                setWork({...work, category: item});
                            }}
                            className={`${
                                work.category === item ? "selected" : ""
                            }`}
                        >
                            {item}
                        </p>
                    ))}
                </div>
                <h3>Add some photos of your work</h3>
                {work.photos.length < 1 && (
                    <div className='photos'>
                        <input
                            id='image'
                            type='file'
                            style={{display: "none"}}
                            accept='image/*'
                            onChange={handleUploadPhotos}
                            multiple
                        />
                        <label htmlFor='image' className='alone'>
                            <div className='icon'>
                                <IoIosImages />
                            </div>
                            <p>Upload from your device</p>
                        </label>
                    </div>
                )}
                {work.photos.length > 0 && (
                    <div className='photos'>
                        {work?.photos?.map((photo, index) => (
                            <div key={index} className='photo'>
                                {photo instanceof Object ? (
                                    <img
                                        src={URL.createObjectURL(photo)}
                                        alt='work'
                                    />
                                ) : (
                                    <img src={photo} alt='work' />
                                )}
                                <button
                                    type='button'
                                    onClick={() => handleRemovePhoto(index)}
                                >
                                    <BiTrash />
                                </button>
                            </div>
                        ))}
                        <input
                            id='image'
                            type='file'
                            style={{display: "none"}}
                            accept='image/*'
                            onChange={handleUploadPhotos}
                            multiple
                        />
                        <label htmlFor='image' className='together'>
                            <div className='icon'>
                                <IoIosImages />
                            </div>
                            <p>Upload from your device</p>
                        </label>
                    </div>
                )}
                <h3>What make your Work attractive?</h3>
                <div className='description'>
                    <p>Title</p>
                    <input
                        type='text'
                        placeholder='Title'
                        onChange={handleChange}
                        onBlur={(e) =>
                            validateInput(e.target.name, e.target.value)
                        }
                        name='title'
                        value={work.title}
                        required
                    />
                    {errors.title && (
                        <p style={{color: "red"}}>{errors.title}</p>
                    )}
                    <p>Description</p>
                    <textarea
                        type='text'
                        placeholder='Description'
                        onChange={handleChange}
                        onBlur={(e) =>
                            validateInput(e.target.name, e.target.value)
                        }
                        name='description'
                        value={work.description}
                        required
                    />
                    {errors.description && (
                        <p style={{color: "red"}}>{errors.description}</p>
                    )}
                    <p>Now, set your PRICE</p>
                    <span>$</span>
                    <input
                        type='number'
                        placeholder='Price'
                        onChange={handleChange}
                        onBlur={(e) =>
                            validateInput(e.target.name, e.target.value)
                        }
                        name='price'
                        value={work.price}
                        required
                        className='price'
                    />
                    {errors.price && (
                        <p style={{color: "red"}}>{errors.price}</p>
                    )}
                </div>
                <Button text={"PUBLISH YOUR WORK"} loading={loading} />
            </form>
        </div>
    );
};
export default Form;
