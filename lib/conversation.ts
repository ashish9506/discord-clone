import { db } from "./db";

export const findOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation = await findConversation({ memberOneId, memberTwoId });

  if (!conversation) {
    conversation = await createNewConversation({ memberOneId, memberTwoId });
  }

  return conversation;
};

const findConversation = async ({
  memberOneId,
  memberTwoId,
}: {
  memberOneId: string;
  memberTwoId: string;
}) => {
  return await db.conversation.findFirst({
    where: {
      AND: [{ memberOneId }, { memberTwoId }],
    },
    include: {
      memberOne: {
        include: {
          profile: true,
        },
      },
      memberTwo: {
        include: {
          profile: true,
        },
      },
    },
  });
};

const createNewConversation = async ({
  memberOneId,
  memberTwoId,
}: {
  memberOneId: string;
  memberTwoId: string;
}) => {
  return await db.conversation.create({
    data: {
      memberOneId,
      memberTwoId,
    },
    include: {
      memberOne: {
        include: {
          profile: true,
        },
      },
      memberTwo: {
        include: {
          profile: true,
        },
      },
    },
  });
};
