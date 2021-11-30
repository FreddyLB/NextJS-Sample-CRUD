import { GetServerSideProps } from "next";
import { getFirebaseAdmin } from "src/firebase/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

const LOGIN_URL = "/";
const HOME_URL = "/products";

export function withAuth<
  P extends { [key: string]: any } = { [key: string]: any }
>(cb: GetServerSideProps<P>): GetServerSideProps<P> {
  return async (context) => {
    const firebase = getFirebaseAdmin();
    const auth = getAuth(firebase);

    const { cookies } = context.req;
    const token = cookies.token;
    const url = context.resolvedUrl;

    if (!token && url !== LOGIN_URL) {
      return { redirect: { destination: LOGIN_URL, permanent: false } };
    }

    if (token) {
      try {
        // An error is throw if the token is invalid
        await auth.verifyIdToken(token);
      } catch (err) {
        console.error(err);
        return { redirect: { destination: HOME_URL, permanent: true } };
      }
    } else {
      return { redirect: { destination: LOGIN_URL, permanent: false } };
    }

    return await cb(context);
  };
}
