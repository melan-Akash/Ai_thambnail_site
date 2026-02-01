import { RectangleHorizontal, RectangleVertical, Square } from "lucide-react"
import { aspectRatios, type AspectRatio } from "../assets/assets"
import { button } from "motion/react-client";

const AspectRatioSelection = ({ value, onChange }: { value: AspectRatio; onchange: (ratio: AspectRatio) => void }) => {

  const iconMap = {
    '16:9': <RectangleHorizontal className="size-6" />,
    '1:1': <Square className="size-6" />,
    '9:16': <RectangleVertical className="size-6" />,
  } as Record<AspectRatio, React.ReactNode>

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-300">
        Aspect Ratio
      </label>

      <div className="flex gap-3">
        {aspectRatios.map((ratio) => {
          const selected = value === ratio

          return (
            <button
              key={ratio}
              type="button"
              onClick={() => onchange(ratio)}
              className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm transition-all
                ${selected
                  ? 'border-white/20 bg-white/10 text-white'
                  : 'border-white/10 text-zinc-300 hover:bg-white/5 hover:border-white/20'
                }`}
            >
              {iconMap[ratio]}
              <span className="tracking-widest">{ratio}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default AspectRatioSelection
