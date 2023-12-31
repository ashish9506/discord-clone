import { currentProfile } from "@/lib/current-profile";
import { v4 as uuid4 } from "uuid";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.serverId)
      return new NextResponse("ServerId Missing", { status: 400 });

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuid4(),
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[ERROR_WHILE_GENERATING_NEW_LINK]", error);
    return new NextResponse("Internal Server", { status: 500 });
  }
}
