import BrainPartSvg from "@/components/BrainPartSvg";
import Button from "@/components/Button";
import { BRAIN_PART_SHAPES } from "@/constants/brainPartShapes";
import { getFunnyQuote } from "@/constants/quotes";
import { useBrainPartMinutes } from "@/hooks/useBrainPartMinutes";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";
import type { BrainPartType } from "@/types";
import { formatMinutes } from "@/utils/time";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

type Region = {
  key: keyof typeof BRAIN_PART_SHAPES;
  type: BrainPartType;
  /** Offset inside the 320px tall map. Each region's hit area is 80px tall. */
  top: number;
  /** SVG height relative to the hit area; shapes overlap on purpose. */
  svgHeight: `${number}%`;
};

const REGIONS: Region[] = [
  { key: "top", type: "Health and Productivity", top: 56, svgHeight: "90%" },
  { key: "middleTop", type: "Social & News", top: 110, svgHeight: "100%" },
  { key: "middleBottom", type: "Video & Audio", top: 160, svgHeight: "104%" },
  { key: "bottom", type: "Games", top: 200, svgHeight: "150%" },
];

/** [base, accent] per band of ROT_BOUNDS, from healthy pink to rotted green. */
const ROT_PALETTE: [string, string][] = [
  ["#d65181", "#ad144a"],
  ["#C86286", "#ad144a"],
  ["#E6B6C7", "#ad144a"],
  ["#AAC7A4", "#6B7D6A"],
  ["#859B80", "#6B7D6A"],
];
const ROT_BOUNDS = [60, 90, 120, 150, 240];
const OVERGROWN: [string, string] = ["#677863", "#677863"];

/** More productive time is good, so that region reads the palette backwards. */
function regionColors(type: BrainPartType, minutes: number): [string, string] {
  const band = ROT_BOUNDS.findIndex((bound) => minutes < bound);
  if (band === -1) return OVERGROWN;
  const inverted = type === "Health and Productivity";
  return ROT_PALETTE[inverted ? ROT_PALETTE.length - 1 - band : band];
}

const LEGEND_COLUMNS = [
  [
    { label: "Giga-Brain", swatch: "bg-[#B54673]" },
    { label: "Fully Conscious", swatch: "bg-[#D16A8E]" },
    { label: "The First Itch", swatch: "bg-[#EBBDCF]" },
  ],
  [
    { label: "Absolute Rot", swatch: "bg-[#6B7D6A]" },
    { label: "Chronically Online", swatch: "bg-[#8CA28B]" },
    { label: "Brain Mush", swatch: "bg-[#ACC1AB]" },
  ],
];

export default function BrainMap() {
  const minutesByPart = useBrainPartMinutes();
  const [selected, setSelected] = useState<Region | null>(null);
  const [showRegionInfo, setShowRegionInfo] = useState(false);

  const selectRegion = (region: Region) => {
    setSelected(region);
    setShowRegionInfo(true);
  };

  return (
    <>
      <View style={{ height: 320 }}>
        {REGIONS.map((region) => {
          const [base, accent] = regionColors(
            region.type,
            minutesByPart[region.type],
          );
          return (
            <Pressable
              key={region.key}
              onPress={() => selectRegion(region)}
              className="absolute left-0 h-20 w-full"
              style={{
                top: region.top,
                transform: [{ scale: selected?.key === region.key ? 1.1 : 1 }],
              }}>
              <BrainPartSvg
                shape={BRAIN_PART_SHAPES[region.key]}
                height={region.svgHeight}
                baseColor={base}
                accentColor={accent}
              />
            </Pressable>
          );
        })}
      </View>

      <View className="mx-6 mb-4 flex-row justify-between gap-3">
        <Button
          title="Brain Info"
          variant="info"
          active={showRegionInfo}
          onPress={() => setShowRegionInfo(true)}
        />
        <Button
          title="Color Info"
          variant="info"
          active={!showRegionInfo}
          onPress={() => setShowRegionInfo(false)}
        />
      </View>

      <View className="mx-6 flex-row items-center justify-between gap-4 rounded-md border-2 border-[#ad144a] px-3 py-2">
        {showRegionInfo ? (
          <RegionInfo
            region={selected}
            minutes={selected ? minutesByPart[selected.type] : 0}
          />
        ) : (
          <Legend />
        )}
      </View>
    </>
  );
}

function RegionInfo({
  region,
  minutes,
}: {
  region: Region | null;
  minutes: number;
}) {
  if (!region) {
    return (
      <View className="w-full">
        <Text className="text-center font-['SpaceGroteskMedium'] text-xl">
          Please select a <Text className="text-primary-700">brain part</Text>{" "}
          to see more
        </Text>
      </View>
    );
  }

  const isProductive = region.type === "Health and Productivity";

  return (
    <View className="w-full gap-1 py-2">
      <Text className="w-full text-center font-['SpaceGroteskMedium'] text-xl">
        {region.type}
      </Text>
      <Text className="font-['SpaceGroteskRegular'] text-lg">
        {isProductive ? "Focus Time: " : "Wasted Time: "}
        <Text className="font-['SpaceGroteskBold'] text-primary-700">
          {formatMinutes(minutes)}
        </Text>
      </Text>
      <Text className="text-md font-['SpaceGroteskRegular'] italic text-gray-600">
        &quot;{getFunnyQuote(region.type, minutes)}&quot;
      </Text>
    </View>
  );
}

function Legend() {
  const isSmall = useIsSmallScreen();

  return (
    <>
      {LEGEND_COLUMNS.map((column, columnIndex) => (
        <View
          key={columnIndex}
          className="flex-1 gap-y-3">
          {column.map((item) => (
            <View
              key={item.label}
              className={`h-10 flex-row items-center ${isSmall ? "gap-x-2" : "gap-x-3"}`}>
              <View
                className={`rounded-md ${item.swatch} ${isSmall ? "h-5 w-5" : "h-7 w-7"}`}
              />
              <Text
                className={`flex-1 font-['SpaceGroteskRegular'] text-gray-800 ${isSmall ? "text-base leading-5" : "text-md"}`}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </>
  );
}
