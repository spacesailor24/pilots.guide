"use client";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  startTime?: number;
  width?: string;
  className?: string;
}

export default function YouTubeEmbed({
  videoId,
  title,
  startTime = 0,
  width = "100%",
  className = "",
}: YouTubeEmbedProps) {
  // Convert YouTube URL to video ID if full URL is provided
  const getVideoId = (id: string) => {
    if (id.includes("youtube.com") || id.includes("youtu.be")) {
      const url = new URL(id);
      if (url.hostname.includes("youtu.be")) {
        return url.pathname.slice(1);
      } else {
        return url.searchParams.get("v") || id;
      }
    }
    return id;
  };

  const cleanVideoId = getVideoId(videoId);
  const embedUrl = `https://www.youtube.com/embed/${cleanVideoId}?start=${startTime}&rel=0&modestbranding=1`;

  return (
    <div
      className={`bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg ${className}`}
    >
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="relative w-full overflow-hidden rounded-md border border-red-600/30">
        <iframe
          src={embedUrl}
          title={title}
          width={width}
          className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] xl:h-[80vh] border-0"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
