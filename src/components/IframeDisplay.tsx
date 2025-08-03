"use client";

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
  return (
    <div className={className}>
      <div className="relative w-full overflow-hidden rounded-md border border-red-600/30">
        <iframe
          src={src}
          title={title}
          width={width}
          className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] xl:h-[80vh] border-0"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
