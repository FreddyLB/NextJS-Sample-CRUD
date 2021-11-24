import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = decodeURIComponent(String(req.query.url));
  const result = await fetch(url);
  const body = result.body;

  if (body == null) {
    return res.status(404).json({ error: "Not found" });
  }

  res.send(body);
}
