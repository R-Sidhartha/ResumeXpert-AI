import { CustomizationValues } from "../validation";
import {
  BREEZE_CUSTOMIZATION,
  IMPACTPRO_CUSTOMIZATION,
  MINIMALIST_CUSTOMIZATION,
  PROFESSIONAL_CUSTOMIZATION,
  SLATE_CUSTOMIZATION,
  SLEEK_CUSTOMIZATION,
  STACKED_CUSTOMIZATION,
} from "./customizations";

export const TEMPLATE_CUSTOMIZATIONS: Record<string, CustomizationValues> = {
  sleek: SLEEK_CUSTOMIZATION,
  professional: PROFESSIONAL_CUSTOMIZATION,
  breeze: BREEZE_CUSTOMIZATION,
  minimalist: MINIMALIST_CUSTOMIZATION,
  slate: SLATE_CUSTOMIZATION,
  impactpro: IMPACTPRO_CUSTOMIZATION,
  stacked: STACKED_CUSTOMIZATION,
};

// fallback default
export const DEFAULT_CUSTOMIZATIONS: CustomizationValues = BREEZE_CUSTOMIZATION;

export const getCustomizationForTemplate = (
  templateId: string,
): CustomizationValues => {
  return TEMPLATE_CUSTOMIZATIONS[templateId] || DEFAULT_CUSTOMIZATIONS;
};
