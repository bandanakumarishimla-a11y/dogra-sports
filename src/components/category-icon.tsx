import {
  CircleDot,
  Shirt,
  Footprints,
  Dribbble,
  Dumbbell,
  School,
} from "lucide-react";
export function CategoryIcon({
  category,
  size = 32,
}: {
  category: string;
  size?: number;
}) {
  const Icon =
    (
      {
        Cricket: CircleDot,
        Sportswear: Shirt,
        Footwear: Footprints,
        "Team sports": Dribbble,
        Fitness: Dumbbell,
        Institutional: School,
      } as Record<string, typeof Shirt>
    )[category] || CircleDot;
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />;
}
