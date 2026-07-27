//? PARTIAL - https://marmalade.hackclub.dev/docs#GET/mailboxes
export interface MailboxResponse {
  jellyMailbox: {
    id: number;
    jellyMailboxId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    isDefault: true;
    isArchived: true;
    jellyTeamId: string;
    existsInJelly: true;
    memberCount: number;
    members: [
      {
        jelly: {
          id: string;
          name: string;
          email: string;
          role: string;
          active: true;
          jellyTeamId: string;
          existsInJelly: true;
          createdAt: Date;
          updatedAt: Date;
        };
        marmalade: {
          id: string;
          name: string;
          email: string;
          emailVerified: true;
          image: string;
          createdAt: Date;
          updatedAt: Date;
        };
      },
    ];
  };
  marmaladeMailbox: {
    id: number;
    jellyMailboxId: string;
    jellyTeamId: string;
    createdAt: Date;
    updatedAt: Date;
    active: true;
    memberCount: number;
    members: [
      {
        jelly: {
          id: string;
          name: string;
          email: string;
          role: string;
          active: true;
          jellyTeamId: string;
          existsInJelly: true;
          createdAt: Date;
          updatedAt: Date;
        };
        marmalade: {
          id: string;
          name: string;
          email: string;
          emailVerified: true;
          image: string;
          createdAt: Date;
          updatedAt: Date;
        };
      },
    ];
  };
  marmaladeMailboxMembership: {
    id: number;
    marmaladeUserId: string;
    marmaladeMailboxId: number;
    createdAt: Date;
    updatedAt: Date;
  };
}
[];

export interface Mailbox {
  marmaladeMailboxId: string;
  marmaladeUserId: string;
  jellyMailboxId: string;
  name: string;
  isDefault: boolean;
  isArchived: boolean;
  memberCount: number;
}
