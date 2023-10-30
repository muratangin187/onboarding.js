import { initSteps } from "./onboarding.js";

const steps = [
  {
    target: "onboardingTarget",
    content:
      "<h1>Hi</h1><p>This is the target</p><button id='overlay-back'>Back</button><button id='overlay-next'>Next</button>",
    raw: true,
  },
  {
    target: "onboardingTarget2",
    content: "This is the second target",
    showButtons: true,
  },
  {
    target: "onboardingTarget3",
    content: "This is the third target",
    showButtons: false,
  },
];

initSteps(steps);
