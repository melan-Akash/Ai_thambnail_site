import { useEffect, useState } from "react";
import SoftBackdrop from "../components/SoftBackdrop";
import type { IThumbnail } from "../assets/assets";
import { dummyThumbnails } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRightIcon, DownloadIcon, TrashIcon } from "lucide-react";
import toast from "react-hot-toast";

const MyGeneration = () => {
  const navigate = useNavigate();

  const aspectRatioClassMap: Record<string, string> = {
    "16:9": "aspect-video",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  };

  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchThumbnails = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/thumbnail/my-thumbnails", {
        credentials: "include"
      });
      const data = await res.json();
      if (res.ok) {
        setThumbnails(data.thumbnails);
      }
    } catch (error) {
      console.error("Failed to fetch thumbnails", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (imageUrl?: string) => {
    if (!imageUrl) return;
    try {
      const toastId = toast.loading("Downloading...");
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ai-thumbnail.jpg";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.dismiss(toastId);
      toast.success("Downloaded successfully!");
    } catch (e) {
      window.open(imageUrl, "_blank");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const toastId = toast.loading("Deleting...");
      const res = await fetch(`http://localhost:3000/api/thumbnail/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      toast.dismiss(toastId);
      if (res.ok) {
        setThumbnails((prev) => prev.filter((t) => t._id !== id));
        toast.success("Thumbnail deleted");
      } else {
        toast.error("Failed to delete thumbnail");
      }
    } catch (error) {
      console.error("Failed to delete thumbnail", error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchThumbnails();
  }, []);

  return (
    <>
      <SoftBackdrop />

      <div className="mt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32">
        {/* header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-200">
            My Generations
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            View and manage all your AI-generated thumbnails
          </p>
        </div>

        {/* loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/6 border border-white/10 animate-pulse h-[260px]"
              />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && thumbnails.length === 0 && (
          <div className="text-center py-24">
            <h3 className="text-lg font-semibold text-zinc-200">
              No thumbnails yet
            </h3>
            <p className="text-sm text-zinc-400 mt-2">
              Generate your first thumbnail to see it here.
            </p>
          </div>
        )}

        {/* grid */}
        {!loading && thumbnails.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-8">
            {thumbnails.map((thumb) => {
              const aspectClass =
                aspectRatioClassMap[thumb.aspect_ratio || "16:9"];

              return (
                <div
                  key={thumb._id}
                  onClick={() => navigate(`/generate/${thumb._id}`)}
                  className="mb-8 group relative cursor-pointer rounded-2xl
                  bg-white/6 border border-white/10 transition shadow-xl break-inside-avoid"
                >
                  {/* image */}
                  <div
                    className={`relative overflow-hidden rounded-t-2xl ${aspectClass} bg-black`}
                  >
                    {thumb.image_url ? (
                      <img
                        src={thumb.image_url}
                        alt={thumb.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-zinc-400">
                        {thumb.isGenerating ? "Generating...." : "No image"}
                      </div>
                    )}

                    {thumb.isGenerating && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm text-zinc-200">
                        Generating....
                      </div>
                    )}
                  </div>

                  {/* content */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2">
                      {thumb.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                      <span className="px-2 py-0.5 rounded bg-white/8">
                        {thumb.style}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/8">
                        {thumb.color_scheme}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/8">
                        {thumb.aspect_ratio}
                      </span>
                    </div>

                    {thumb.createdAt && (
                      <p className="text-xs text-zinc-500">
                        {new Date(thumb.createdAt).toDateString()}
                      </p>
                    )}
                  </div>

                  {/* actions */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-2 right-2 max-sm:flex sm:hidden group-hover:flex gap-1.5"
                  >
                    <TrashIcon
                      onClick={() => handleDelete(thumb._id)}
                      className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all"
                    />
                    <DownloadIcon
                      onClick={() => handleDownload(thumb.image_url)}
                      className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all"
                    />
                    <Link
                      target="_blank"
                      to={`/preview?thumbnail_url=${thumb.image_url}&title=${thumb.title}`}
                    >
                      <ArrowRightIcon className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MyGeneration;



// not working colors not show