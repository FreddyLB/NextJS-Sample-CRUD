import * as firebaseAuth from "firebase-admin/auth";
import { NextApiRequestWithParams } from "@server/core/withApiRoutes";
import { NextApiResponse } from "next";
import { NextHandler } from "next-connect";

export type RequestWithUser = NextApiRequestWithParams & {
  user?: firebaseAuth.DecodedIdToken;
};

export async function authMiddleware(
  req: RequestWithUser,
  res: NextApiResponse,
  next: NextHandler
) {
  console.log("authMiddleware");
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send("Unauthorized");
  }

  const token = authorization.split(" ");
  if (token.length !== 2 || token[0] != "Bearer ") {
    return res.status(401).send("Unauthorized");
  }

  const idToken = token[1];
  const auth = firebaseAuth.getAuth();
  
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch {
    return res.status(401).send("Unauthorized");
  }
}
