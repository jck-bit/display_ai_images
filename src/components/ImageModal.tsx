/* eslint-disable @typescript-eslint/no-explicit-any */

import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Copy, Trash2, Heart } from 'lucide-react';

interface ImageModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    image_url: string;
    image_uuid: string;
    promptText: string;
    isLikedInitially: boolean;
    onDelete: (imageUuid: string, imageListName: 'homeImages' | 'likedImages') => Promise<void>;
    onLikeToggle: (imageUuid: string, currentLikedStatus: boolean) => Promise<void>;
    imageListName: 'homeImages' | 'likedImages';
}

const ImageModal: React.FC<ImageModalProps> = ({
    isOpen,
    setIsOpen,
    image_url,
    image_uuid,
    promptText,
    isLikedInitially,
    onDelete,
    onLikeToggle,
    imageListName
}) => {
    const [isLiked, setIsLiked] = useState(isLikedInitially);
    const [copySuccess, setCopySuccess] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [, setDeleteError] = useState<string | null>(null);
    const copyTimeout = useRef<NodeJS.Timeout | null>(null);
    const copyButtonRef = useRef<HTMLButtonElement>(null);

    // Reset states when modal closes or image changes
    useEffect(() => {
        if (!isOpen) {
            setIsDeleting(false); 
            setDeleteError(null); 
            }
    }, [isOpen]);

    useEffect(() => {
        setIsLiked(isLikedInitially);
    }, [isLikedInitially]);

    const handleToggleLike = async () => {
        try {
            await onLikeToggle(image_uuid, isLiked);
            setIsLiked(!isLiked);
            console.log(isLiked ? "Image unliked successfully" : "Image liked successfully");
        } catch (error: any) {
            console.error('Error toggling like status in modal:', error);
            setDeleteError(error.message || 'Failed to update like status.');
        }
    };

    const handleDeleteImage = async () => {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await onDelete(image_uuid, imageListName);
            setIsOpen(false); 
        } catch (error: any) {
            console.error('Error deleting image in modal:', error);
            setDeleteError(error.message || 'Failed to delete image.');
            setIsDeleting(false); 
        }
    };

    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(promptText);
            setCopySuccess(true);
            if (copyTimeout.current) {
                clearTimeout(copyTimeout.current);
            }
            copyTimeout.current = setTimeout(() => {
                setCopySuccess(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setCopySuccess(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="bg-slate-900/20 backdrop-blur p-3 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: "12.5deg" }}
                        animate={{ scale: 1, rotate: "0deg" }}
                        exit={{ scale: 0, rotate: "0deg" }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white text-gray-900 p-3 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
                    >
                        <div className="relative z-10 flex flex-col items-center">
                            <img
                                alt={promptText}
                                src={image_url}
                                className="object-cover rounded-lg w-full"
                            />
                            <div className="flex space-x-2">
                                <a className="group block rounded overflow-hidden absolute top-0 left-0 w-full h-full">
                                    <figcaption className="absolute inset-0 transition-opacity opacity-0 group-hover:opacity-100 text-white pointer-events-none rounded-lg bg-gradient-to-t from-black/60 via-black/40 to-transparent">
                                        <div className="absolute bottom-0 left-0 w-full p-4 space-y-4" style={{ fontFamily: "Raleway" }}>
                                            <p className="text-white text-base leading-normal _12jn0ku1 overflow-hidden text-ellipsis nika-negative line-clamp-3" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>
                                                {promptText}
                                            </p>
                                            <div className="w-full flex items-center gap-2">
                                                <button
                                                    ref={copyButtonRef}
                                                    className={`h-10 px-4 py-0 text-white flex items-center justify-center gap-2 cursor-pointer bg-transparent hover:bg-white/10 focus:bg-white/20 transition-all border border-solid rounded-full text-base font-semibold border-grayHeather pointer-events-auto relative ${copySuccess ? 'button-copied' : ''}`}
                                                    onClick={handleCopyToClipboard}
                                                >
                                                    <Copy size={24} color="#ffffff" />
                                                    <p className="transition-opacity duration-300">{copySuccess ? "Copied!" : "copy this prompt"}</p>
                                                    {copySuccess && (
                                                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-green-500 rounded-full opacity-0 animate-fade-in-out text-white font-bold pointer-events-none">
                                                            Copied!
                                                        </div>
                                                    )}
                                                </button>

                                                <button
                                                    className="rounded-full p-2 bg-red-200/50 hover:bg-red-300/70 text-red-700 hover:text-red-800 cursor-pointer pointer-events-auto relative"
                                                    aria-label="Delete image"
                                                    onClick={handleDeleteImage}
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? (
                                                        <svg className="animate-spin h-5 w-5 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <Trash2 size={20} color="#c01c28" />
                                                    )}
                                                </button>

                                                <button
                                                    className="rounded-full p-2 bg-gray-200/50 hover:bg-gray-300/70 text-gray-700 hover:text-gray-800 cursor-pointer pointer-events-auto"
                                                    aria-label={isLiked ? "Unlike image" : "Like image"}
                                                    onClick={handleToggleLike}
                                                >
                                                    <Heart size={20} color={isLiked ? "red" : "currentColor"} fill={isLiked ? "red" : "none"} />
                                                </button>
                                            </div>
                                        </div>
                                    </figcaption>
                                </a>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700 font-semibold w-full py-2 rounded mt-4"
                        >
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ImageModal;