import { makeStyles } from "@material-ui/core";

const useAnimations = makeStyles(() => ({
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
  animateSlideRightFadeIn: {
    animation: "$slideRightFadeIn 0.5s",
  },
}));
