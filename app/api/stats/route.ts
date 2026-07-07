import { getStats } from "@/lib/nephthys";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    return Response.json(await getStats(url.searchParams.get("host"), url.searchParams.get("cachetEnriched") === "true"));
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Upstream failed" },
      { status: 502 },
    );
  }
}
