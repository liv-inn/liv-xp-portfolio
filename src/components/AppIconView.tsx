import type { AppIcon } from "../windows/registry";

interface Props {
  icon: AppIcon;
  alt: string;
  className?: string;
}

function AppIconView({ icon: Icon, alt, className }: Props) {
  if (typeof Icon === "string") return <img src={Icon} alt={alt} className={className} draggable={false} />;
  return <Icon className={className} />;
}

export default AppIconView;
