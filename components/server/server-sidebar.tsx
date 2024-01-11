import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "./server-search";

interface ServerSidebarProps {
  serverId: string;
}

const channelIcons = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mt-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mt-2 h-4 w-4" />,
};

const memberRoleIcons = {
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.GUEST]: null,
};
export const ServerSideBar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) return redirect("/");

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full w-full text-primary dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="px-3 flex-1">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                payload: textChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcons[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                payload: audioChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcons[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                payload: videoChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcons[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                payload: members.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: memberRoleIcons[member.role],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
