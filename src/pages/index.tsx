import { Box, Paper, Typography } from "@mui/material";
import { GoogleLoginButton } from "react-social-login-buttons";
import { withAuth } from "src/auth/withAuth";
import { withAuthGetServerSideProps } from "src/auth/withAuthGetServerSideProps";
import { useAuth } from "src/hooks/useAuth";

export const getServerSideProps = withAuthGetServerSideProps();

function Home() {
  const { loginWithGoogle } = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: [5, 10],
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: "40px 30px",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 3,
          width: ["100%", "60%", "40%"],
        }}
      >
        <Typography
          sx={{
            fontFamily: "monospace",
            fontWeight: "bold",
            fontSize: 18,
            marginBottom: 2,
          }}
        >
          Login with
        </Typography>
        <GoogleLoginButton onClick={loginWithGoogle}>
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: [13, 15],
            }}
          >
            Login with google
          </Typography>
        </GoogleLoginButton>
      </Paper>
    </Box>
  );
}

export default withAuth(Home);
