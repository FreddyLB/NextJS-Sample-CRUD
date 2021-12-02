import { SocialSignIn } from "@shared/models/social-signin.model";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { provider, token } = req.body as SocialSignIn;
    res.status(200).json({
      provider,
      token,
    });
  }
}
