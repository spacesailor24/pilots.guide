"use client";

import { useState, useEffect } from "react";

interface IframeDisplayProps {
  src: string;
  title: string;
  width?: string;
  className?: string;
}

export default function IframeDisplay({
  src,
  title,
  width = "100%",
  className = "",
}: IframeDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [src]);

  return (
    <div className={className}>
      <div className="relative w-full overflow-hidden rounded-md border border-red-600/30 bg-black">
        {isLoading && (
          <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-red-400 text-sm">Loading build...</span>
            </div>
          </div>
        )}
        <iframe
          src={src}
          title={title}
          width={width}
          className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] xl:h-[80vh] border-0 bg-black"
          allowFullScreen
          loading="lazy"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}
