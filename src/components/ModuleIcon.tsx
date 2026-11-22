import {
  CalendarDays,
  ClipboardCheck,
  Gavel,
  GraduationCap,
  Inbox,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type { ModuleKey, TipoCorrespondencia } from "../types";

const MODULE_ICONS: Record<ModuleKey, LucideIcon> = {
  dictamenes: Gavel,
  programaciones: CalendarDays,
  correspondencia: Inbox,
  auxiliatura: GraduationCap,
};

const TIPO_ICONS: Record<TipoCorrespondencia, LucideIcon> = {
  examenes: ClipboardCheck,
  "cursos-verano": Sun,
};

interface ModuleIconProps {
  module: ModuleKey;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ModuleIcon({
  module,
  size = 20,
  strokeWidth = 2,
  className,
}: ModuleIconProps) {
  const Icon = MODULE_ICONS[module];
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}

interface TipoIconProps {
  tipo: TipoCorrespondencia;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function TipoIcon({
  tipo,
  size = 20,
  strokeWidth = 2,
  className,
}: TipoIconProps) {
  const Icon = TIPO_ICONS[tipo];
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}
