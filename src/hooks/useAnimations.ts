import { makeStyles } from "@material-ui/core";

export const useAnimationsClases = makeStyles(() => ({
  // Keyframes
  "@keyframes slideRightFadeIn": {
    from: {
      opacity: 0,
      transform: "translateX(100%)",
    },
    to: {
      opacity: 1,
      transform: "translateX(0)",
    },
  },
  "@keyframes slideLeftFadeIn": {
    from: {
      opacity: 0,
      transform: "translateX(-100%)",
    },
    to: {
      opacity: 1,
      transform: "translateX(0)",
    },
  },

  // Classes
  animateSlideRightFadeIn: {
    animation: "$slideRightFadeIn 0.5s forwards",
    opacity: 0,
    transform: "translateX(100%)",
  },
  animateSlideLeftFadeIn: {
    animation: "$slideLeftFadeIn 0.5s forwards",
    opacity: 0,
    transform: "translateX(-100%)",
  },
}));
