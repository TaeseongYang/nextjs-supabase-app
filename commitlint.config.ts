import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],
    "subject-case": [2, "never", ["start-case", "upper-case", "pascal-case"]],
    "subject-max-length": [2, "always", 72],
    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
    "body-max-line-length": [2, "always", 100],
    "scope-case": [2, "always", "lower-case"],
  },
  parserPreset: {
    parserOpts: {
      // 이모지 접두사 허용: "✨ feat: ..." 형식 지원 (기존 커밋 히스토리 호환)
      headerPattern:
        /^(?:[\p{Emoji_Presentation}\p{Extended_Pictographic}]\s)?(\w*)(?:\(([^)]*)\))?!?: (.*)$/u,
      headerCorrespondence: ["type", "scope", "subject"],
    },
  },
};

export default config;
