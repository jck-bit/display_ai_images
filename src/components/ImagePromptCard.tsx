import React from 'react';

interface ImagePromptCardProps {
  imageFile: string;
  promptText: string;
  detailsPath: string;
  aspectRatio?: string;
  onUsePrompt?: () => void;
}

const ImagePromptCard: React.FC<ImagePromptCardProps> = ({
  imageFile,
  promptText,
  detailsPath,
  aspectRatio = "128.636%",
}) => {
  const imagePath = `/images/${imageFile}`;

  return (
    <figure className="relative" style={{ paddingBottom: aspectRatio }}>
      <a
        className="group block rounded overflow-hidden absolute top-0 left-0 w-full h-full"
        href={detailsPath}
      >
        <img
          alt={promptText}
          loading="lazy"
          decoding="async"
          className="object-cover rounded-lg"
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            inset: "0px",
            color: "transparent",
          }}
          src={imagePath}
        />

        <figcaption
          className="_12jn0ku0 absolute inset-0 transition-opacity opacity-0 group-hover:opacity-100 text-white pointer-events-none rounded-lg bg-gradient-to-t from-black/60 via-black/40 to-transparent"
        >
          <div className="absolute bottom-0 left-0 w-full p-4 space-y-4">
            <p className="text-white text-base leading-normal _12jn0ku1 overflow-hidden text-ellipsis">
              {promptText}
            </p>
            <div className="w-full">
              <button
                className="h-10 px-4 py-0 text-white flex items-center justify-center gap-2 cursor-pointer bg-transparent hover:bg-white/10 focus:bg-white/20 transition-all border border-solid rounded-full text-base font-semibold border-grayHeather pointer-events-auto"
              >            Use this prompt
              </button>
            </div>
          </div>
        </figcaption>

      </a>
    </figure>
  );
};

export default ImagePromptCard;