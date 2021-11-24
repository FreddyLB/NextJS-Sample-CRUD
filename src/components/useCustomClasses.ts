import { makeStyles } from "@material-ui/core";

export const useCustomClasses = makeStyles((theme) => ({
  blackBtn: {
    backgroundColor: "black",
    "&:hover": {
      backgroundColor: "#202020",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
}));
