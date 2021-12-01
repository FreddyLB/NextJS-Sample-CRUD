import { GetServerSideProps, GetServerSidePropsResult } from "next";
import { getFirebaseAdmin } from "src/firebase/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";
import { HOME_URL, LOGIN_URL } from "./constants";

type Props = { [key: string]: any };
type GetProps<P> = GetServerSideProps<P>;

const EMPTY_PROPS: GetServerSidePropsResult<any> = Object.freeze({ props: {} });

// prettier-ignore
export function withAuthGetServerSideProps<P extends Props = Props>(cb?: GetProps<P>): GetProps<P> {
  return async (context) => {
    const firebase = getFirebaseAdmin();
    const auth = getAuth(firebase);

    const { cookies } = context.req;
    const token = cookies.token;
    const url = context.resolvedUrl;

    // if (!token && url !== LOGIN_URL) {
    //   return { redirect: { destination: LOGIN_URL, permanent: true } };
    // }

    // let isAuthenticated = false;

    // if (token) {
    //   try {
    //     // An error is throw if the token is invalid
    //     await auth.verifyIdToken(token);
    //     isAuthenticated = true;
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }

    // // If is authenticated and is in login page, redirect to home page
    // if (isAuthenticated && url === LOGIN_URL) {
    //   return { redirect: { destination: HOME_URL, permanent: true } };
    // }

    // // If is not authenticated and is in other page, redirect to login page
    // if (!isAuthenticated && url !== LOGIN_URL) {
    //   return { redirect: { destination: LOGIN_URL, permanent: true } };
    // }

    if (cb) {
      return await cb(context);
    }

    return EMPTY_PROPS;
  };
}
