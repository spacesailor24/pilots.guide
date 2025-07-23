"use client";

interface IframeDisplayProps {
  src: string;
  title: string;
  width?: string;
  height?: string;
  className?: string;
}

export default function IframeDisplay({
  src,
  title,
  width = "100%",
  height = "600px",
  className = "",
}: IframeDisplayProps) {
  return (
    <div>
      <div className="relative w-full overflow-hidden rounded-md border border-red-600/30">
        <iframe
          src={src}
          title={title}
          width={width}
          height={height}
          className="w-full"
          style={{ minHeight: height }}
          frameBorder="0"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
