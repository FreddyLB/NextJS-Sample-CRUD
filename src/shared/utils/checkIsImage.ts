export async function checkIsImage(url: string): Promise<boolean> {
  const res = await fetch(url, {
    method: "HEAD",
  });

  const contentType = res.headers.get("content-type");
  return !!contentType && contentType.includes("image");
}
