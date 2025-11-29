import { Button } from "@/components/ui/button";
import { LuCoins } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import { BiLockAlt } from "react-icons/bi";

interface SkinCardProps {
  color: string;
  name: string;
  isActive?: boolean;
  isLocked?: boolean;
  cost?: number;
  tag?: string;
  tagColor?: string;
  onSelect?: () => void;
}

const SkinCard = ({
  color,
  name,
  isActive = false,
  isLocked = false,
  cost,
  tag,
  tagColor,
  onSelect,
}: SkinCardProps) => {
  // Check if color is light/white for text contrast
  const isLightColor = (hexColor: string) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 180; // Threshold for light colors
  };

  const textColor = !isActive && !isLocked && isLightColor(color) ? 'text-black' : 'text-white';

  return (
    <div
      className={`flex items-center gap-3 ${
        isActive ? "border-2 border-[#FF1414]" : "border border-gray-700"
      } bg-[#20366999] rounded-xl p-4 mx-5 hover:border-gray-600 transition-all`}
    >
      {/* Skin Color Preview */}
      <div
        className="w-12 h-12 rounded-lg shadow-md flex-shrink-0"
        style={{ backgroundColor: color }}
      ></div>
      
      {/* Skin Info */}
      <div className="flex-1 flex flex-col gap-1">
        <p className="text-white font-medium text-left">{name}</p>
        {tag && (
          <span
            className="border rounded-full px-2.5 py-0.5 text-[10px] font-semibold w-fit"
            style={{ borderColor: tagColor, color: tagColor }}
          >
            {tag}
          </span>
        )}
      </div>
      
      {/* Action Button */}
      <Button
        className={`w-28 py-5 hover:scale-105 cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
          isActive 
            ? "bg-green-600 hover:bg-green-700" 
            : isLocked 
            ? "bg-gray-600 hover:bg-gray-700" 
            : ""
        }`}
        style={
          !isActive && !isLocked
            ? { backgroundColor: color, opacity: 0.9 }
            : undefined
        }
        onClick={onSelect}
      >
        {isActive ? (
          <>
            <FaCheck className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold">Active</span>
          </>
        ) : isLocked ? (
          <>
            <BiLockAlt className="w-5 h-5 text-gray-300" />
            <span className="text-sm text-gray-300">{cost}</span>
          </>
        ) : cost ? (
          <>
            <LuCoins className={`w-4 h-4 ${textColor}`} />
            <span className={`text-sm font-semibold ${textColor}`}>{cost}</span>
          </>
        ) : (
          <span className={`text-sm font-semibold ${textColor}`}>Select</span>
        )}
      </Button>
    </div>
  );
};

export default SkinCard;
