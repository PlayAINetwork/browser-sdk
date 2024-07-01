import { z } from "zod";

const PlayAIStyles = z.object({
  actionBar: z
    .object({
      backgroundColor: z.string().optional().default("transparent"),
      borderColor: z.string().optional().default("transparent"),
      textColor: z.string().optional().default("#ffffff"),
      borderRadius: z.string().optional().default("27px"),
      dividerColor: z.string().optional().default("rgba(48, 48, 48)"),
      hover: z
        .object({
          backgroundColor: z.string().optional().default("rgb(19, 19, 19)"),
          borderColor: z.string().optional().default("transparent"),
          boxShadow: z.string().optional().default("rgba(0, 0, 0, 0.42) 0px 0px 14px 5px")
        })
        .optional()
        .default({})
    })
    .optional()
    .default({}),
  playAIIcon: z
    .object({
      color: z.string().optional().default("#ffffff"),
      borderColor: z.string().optional().default("rgba(255, 255, 255, 0.5)"),
      backgroundColor: z.string().optional().default("transparent"),
      hover: z
        .object({
          color: z.string().optional().default("#ee4b4b"),
          borderColor: z.string().optional().default("rgba(255, 255, 255, 0.5)"),
          backgroundColor: z.string().optional().default("transparent")
        })
        .optional()
        .default({})
    })
    .optional()
    .default({}),

  recording: z
    .object({
      dashboardIconColor: z.string().optional().default("#ffffff"),
      errorIconColor: z.string().optional().default("#cb792e"),
      button: z
        .object({
          iconColor: z.string().optional().default("#ee4b4b"),
          backgroundColor: z.string().optional().default("rgba(36, 36, 36, 1)"),
          textColor: z.string().optional().default("#ffffff"),
          borderColor: z.string().optional().default("transparent")
        })
        .optional()
        .default({})
    })
    .optional()
    .default({}),

  onboardingButton: z
    .object({
      backgroundColor: z.string().optional().default("rgba(44, 26, 26, 1)"),
      textColor: z.string().optional().default("rgba(238, 75, 75, 1)"),
      iconColor: z.string().optional().default("#ee4b4b"),
      borderColor: z.string().optional().default("rgba(238, 75, 75, 0.35)")
    })
    .optional()
    .default({})
});
type PlayAIStyles = z.infer<typeof PlayAIStyles>;

export default PlayAIStyles;
