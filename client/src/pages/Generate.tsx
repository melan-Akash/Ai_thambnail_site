import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { colorSchemes, dummyThumbnails, type AspectRatio, type IThumbnail, type ThumbnailStyle } from "../assets/assets";
import SoftBackdrop from "../components/SoftBackdrop";
import AspectRatioSelection from "../components/AspectRatioSelection";
import StyleSelector from "../components/StyleSelector";
import ColorSchemeSelector from "../components/ColorSchemeSelector";
import PreviewPanel from "../components/PreviewPanel";
import toast from "react-hot-toast";

const Generate = () => {
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
  const [loading, setLoading] = useState(false);

  const [aspectRatios, setAspectRatios] = useState<AspectRatio>('16:9');
  const [colorSchemeId, setColorSchemeId] = useState<string>(colorSchemes[0].id);
  const [style, setStyle] = useState<ThumbnailStyle>('Bold & Graphic');

  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/thumbnail/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({
          title,
          prompt: additionalDetails,
          style,
          aspect_ratio: aspectRatios,
          color_scheme: colorSchemeId,
        })
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to generate thumbnail");
        return;
      }
      setThumbnail(data.thumbnail);
      toast.success("Thumbnail generated successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchThumbnail = async () => {
    if (id) {
      const thumbnail: any = dummyThumbnails.find((thumbnail) => thumbnail._id === id);
      if (thumbnail) {
        setThumbnail(thumbnail);
        setAdditionalDetails(thumbnail.user_prompt);
        setTitle(thumbnail.title);
        setColorSchemeId(thumbnail.color_scheme);
        setAspectRatios(thumbnail.aspect_ratio);
        setStyle(thumbnail.style);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchThumbnail();
    }
  }, [id]);

  return (
    <>
      <SoftBackdrop />

      <div className="pt-24 min-h-screen ">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 lg:pb-8">
          <div className="grid lg:grid-cols-[400px_1fr] gap-0">
            {/* left panel */}
            <div className={`space-y-6 ${id && 'pointer-events-none'}`}>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 mb-1">Create Your Thumbnail</h2>
                  <p className="text-sm text-zinc-400">Describe your vision and let AI bring it to life.</p>
                </div>

                <div className="space-y-5">
                  {/* title input */}
                  <div>
                    <label className="block text-sm font-medium ">Title or Topic</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                      placeholder="e.g., 10 Tips for Better Sleep"
                      className="w-full px-4 py-3 rounded-lg border border-white/12 bg-black/20 
                      text-zinc-100 placeholder:text-zinc-400 focus:ring-2 focus:ring-pink-500"
                    />
                    <div className="flex justify-end">
                      <span className="text-xs text-zinc-400">{title.length}/100</span>
                    </div>
                  </div>

                  {/* AspectRatioSelection */}
                  <AspectRatioSelection value={aspectRatios} onChange={setAspectRatios} />

                  {/* Style selector */}
                  <StyleSelector
                    value={style}
                    onChange={setStyle}
                    isOpen={styleDropdownOpen}
                    setIsOpen={setStyleDropdownOpen}
                  />

                  {/* color slector */}
                  <ColorSchemeSelector value={colorSchemeId} onChange={setColorSchemeId} />

                  {/* Additional details */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Additional prompts <span>(optional)</span>
                    </label>
                    <textarea
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      rows={3}
                      placeholder="Add any specific element, mood, or style preference..."
                      className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/6 text-zinc-100
                      placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    />
                  </div>
                </div>

                {/* button */}
                {!id && (
                  <button
                    onClick={handleGenerate}
                    className="text-[15px] w-full py-3.5 rounded-xl font-medium bg-linear-to-b from-pink-500 to-pink-600
                    hover:from-pink-700 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Generating...' : "Generate Thumbnail"}
                  </button>
                )}
              </div>
            </div>

            {/* Right panel */}
            <div className="ml-10">
              <div className="p-6 rounded-2xl bg-white/8 border border-white/10 shadow-xl ">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Preview</h2>
                <PreviewPanel thumbnail={thumbnail} isLoading={loading} aspectRatio={aspectRatios} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Generate;
