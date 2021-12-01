import * as firebaseAuth from "firebase-admin/auth";
import { NextApiRequestWithParams } from "@server/core/withApiRoutes";
import { NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { IUser } from "@shared/models/user.model";
import User from "@server/database/mongodb/schemas/user.schema";

export type RequestWithUser = NextApiRequestWithParams & {
  user?: IUser;
  decodedIdToken?: firebaseAuth.DecodedIdToken;
};

export async function authMiddleware(
  req: RequestWithUser,
  res: NextApiResponse,
  next: NextHandler
) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send("Unauthorized");
  }

  const token = authorization.split(" ");
  if (token.length !== 2 || token[0] != "Bearer") {
    return res.status(401).send("Unauthorized");
  }

  const idToken = token[1];
  const auth = firebaseAuth.getAuth();

  try {
    const decodedIdToken = await auth.verifyIdToken(idToken);

    // Currently only Google authentication is supported,
    // so we can safely create a new user using the user uid if don't exist
    const user = await User.findOneAndUpdate(
      { userId: decodedIdToken.uid },
      {},
      { upsert: true }
    );

    req.decodedIdToken = decodedIdToken;
    req.user = user ?? undefined;
    next();
  } catch {
    return res.status(401).send("Unauthorized");
  }
}
