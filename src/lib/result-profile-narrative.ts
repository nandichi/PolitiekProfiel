import { DIMENSIONS, type DimensionId } from "@/lib/dimensions";
import type { DimensionConfidence } from "@/lib/confidence";
import type { DimensionScores } from "@/lib/scoring";
import { THEMES, type ThemeId, type ThemeScores } from "@/lib/themes";

const STRONG_AXIS_THRESHOLD = 25;
const OPEN_AXIS_THRESHOLD = 10;
const STRONG_THEME_THRESHOLD = 25;

export interface ProfileAxis {
  id: DimensionId;
  label: string;
  score: number;
  direction: string;
  explanation: string;
  confidence?: number;
}

export interface ProfileThemeSignal {
  id: ThemeId;
  label: string;
  score: number;
  direction: string;
  explanation: string;
}

export interface PersonalProfile {
  lead: string;
  strongestAxes: ProfileAxis[];
  openAxes: ProfileAxis[];
  contextualAxes: ProfileAxis[];
  themeSignals: ProfileThemeSignal[];
  coverage: {
    label: string;
    message: string;
    percentage: number;
  };
}

function formatList(values: string[]): string {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} en ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} en ${values.at(-1)}`;
}

function describeAxis(
  id: DimensionId,
  score: number,
  confidence?: number,
): ProfileAxis {
  const meta = DIMENSIONS.find((dimension) => dimension.id === id)!;
  const positive = score >= 0;
  const pole = positive ? meta.polePositive : meta.poleNegative;
  const abs = Math.abs(score);
  const prefix =
    abs < OPEN_AXIS_THRESHOLD
      ? "Je antwoorden blijven hier dicht bij het midden."
      : abs < STRONG_AXIS_THRESHOLD
        ? "Je antwoorden wijzen voorzichtig deze kant op."
        : "Je antwoorden wijzen hier duidelijk deze kant op.";

  return {
    id,
    label: meta.label,
    score,
    direction: abs < OPEN_AXIS_THRESHOLD ? "Open midden" : pole.label,
    explanation:
      abs < OPEN_AXIS_THRESHOLD
        ? `${prefix} De quiz kan daarom geen uitgesproken voorkeur tussen ${meta.poleNegative.label.toLowerCase()} en ${meta.polePositive.label.toLowerCase()} onderbouwen.`
        : `${prefix} ${pole.description}`,
    confidence,
  };
}

function describeTheme(id: ThemeId, score: number): ProfileThemeSignal {
  const meta = THEMES.find((theme) => theme.id === id)!;
  const positive = score >= 0;
  const pole = positive ? meta.polePositive : meta.poleNegative;

  return {
    id,
    label: meta.label,
    score,
    direction: pole.label,
    explanation: `${pole.description} Dit is een themapatroon uit de stellingen die je op dit onderwerp beantwoordde.`,
  };
}

export function createPersonalProfile({
  ideologyName,
  dimensions,
  themeScores,
  confidence,
  answeredCount,
  totalQuestions,
}: {
  ideologyName: string;
  dimensions: DimensionScores;
  themeScores?: ThemeScores;
  confidence?: DimensionConfidence;
  answeredCount: number;
  totalQuestions: number;
}): PersonalProfile {
  const axes = DIMENSIONS.map((dimension) =>
    describeAxis(
      dimension.id,
      Number.isFinite(dimensions[dimension.id]) ? dimensions[dimension.id] : 0,
      confidence?.[dimension.id],
    ),
  );
  const strongestAxes = axes
    .filter((axis) => Math.abs(axis.score) >= STRONG_AXIS_THRESHOLD)
    .sort((a, b) => Math.abs(b.score) - Math.abs(a.score));
  const openAxes = axes.filter((axis) => Math.abs(axis.score) < OPEN_AXIS_THRESHOLD);
  const contextualAxes = axes.filter(
    (axis) =>
      Math.abs(axis.score) >= OPEN_AXIS_THRESHOLD &&
      Math.abs(axis.score) < STRONG_AXIS_THRESHOLD,
  );
  const themeSignals = themeScores
    ? THEMES.map((theme) =>
        describeTheme(theme.id, Number.isFinite(themeScores[theme.id]) ? themeScores[theme.id] : 0),
      )
        .filter((theme) => Math.abs(theme.score) >= STRONG_THEME_THRESHOLD)
        .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
        .slice(0, 3)
    : [];

  const safeTotal = Math.max(0, totalQuestions);
  const percentage = safeTotal > 0 ? Math.round((answeredCount / safeTotal) * 100) : 0;
  const coverageLabel =
    safeTotal > 0
      ? `${answeredCount} van ${safeTotal} stellingen beantwoord`
      : `${answeredCount} stellingen beantwoord`;
  const averageConfidence = confidence
    ? DIMENSIONS.reduce((sum, dimension) => sum + (confidence[dimension.id] ?? 0), 0) /
      DIMENSIONS.length
    : undefined;
  const coverageMessage =
    percentage >= 80 && (averageConfidence === undefined || averageConfidence >= 60)
      ? "Er ligt voldoende antwoordmateriaal onder dit profiel om duidelijke patronen te bespreken. Ook dan blijven middens en gemengde antwoorden betekenisvol."
      : "Lees duidelijke richtingen voorzichtig. Met deze antwoorddekking is het zinvoller om te kijken naar patronen en open vragen dan naar een hard etiket.";

  const strongDirections = strongestAxes.slice(0, 3).map((axis) => axis.direction.toLowerCase());
  const openDirections = openAxes.slice(0, 2).map((axis) => axis.label.toLowerCase());
  const leadParts = [`Deze uitkomst ligt het dichtst bij ${ideologyName}.`];
  if (strongDirections.length > 0) {
    leadParts.push(`De duidelijkste lijnen lopen naar ${formatList(strongDirections)}.`);
  } else {
    leadParts.push("Je antwoorden vormen nog geen scherpe richting op de vijf assen.");
  }
  if (openDirections.length > 0) {
    leadParts.push(`Op ${formatList(openDirections)} laat je juist ruimte voor meerdere richtingen.`);
  }
  leadParts.push("Het is een momentopname van je antwoorden, geen stemadvies en geen vast label.");

  return {
    lead: leadParts.join(" "),
    strongestAxes,
    openAxes,
    contextualAxes,
    themeSignals,
    coverage: {
      label: coverageLabel,
      message: coverageMessage,
      percentage,
    },
  };
}
