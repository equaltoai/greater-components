import type { Status, Account, Notification } from './types';

export const mockAccount: Account = {
  id: '1',
  username: 'alice',
  acct: 'alice@mastodon.social',
  displayName: 'Alice Johnson',
  avatar: 'https://via.placeholder.com/48',
  url: 'https://mastodon.social/@alice',
  followersCount: 1234,
  followingCount: 567,
  statusesCount: 890,
  bot: false,
  locked: false,
  verified: true,
  createdAt: '2023-01-01T00:00:00Z',
  note: 'Software developer and open source enthusiast'
};

export const mockStatus: Status = {
  id: '109876543210',
  uri: 'https://mastodon.social/@alice/109876543210',
  url: 'https://mastodon.social/@alice/109876543210',
  account: mockAccount,
  content: '<p>Just released a new version of my <a href="#opensource">#opensource</a> project! Check it out at <a href="https://github.com/alice/project">github.com/alice/project</a> 🚀</p><p>Thanks to everyone who contributed!</p>',
  createdAt: new Date().toISOString(),
  visibility: 'public',
  repliesCount: 12,
  reblogsCount: 45,
  favouritesCount: 89,
  reblogged: false,
  favourited: false,
  bookmarked: false,
  muted: false,
  pinned: false,
  mediaAttachments: [],
  mentions: [],
  tags: [
    {
      name: 'opensource',
      url: 'https://mastodon.social/tags/opensource'
    }
  ]
};

export function generateMockStatuses(count: number): Status[] {
  const statuses: Status[] = [];
  
  for (let i = 0; i < count; i++) {
    const account: Account = {
      ...mockAccount,
      id: `user-${i}`,
      username: `user${i}`,
      acct: `user${i}@mastodon.social`,
      displayName: `User ${i}`,
      avatar: `https://via.placeholder.com/48?text=U${i}`
    };

    const status: Status = {
      id: `status-${i}`,
      uri: `https://mastodon.social/@user${i}/status-${i}`,
      url: `https://mastodon.social/@user${i}/status-${i}`,
      account,
      content: `<p>This is status number ${i + 1}. Here's some content with a <a href="#hashtag">#hashtag</a> and a mention of <a href="/@alice">@alice</a>.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      visibility: 'public',
      repliesCount: Math.floor(Math.random() * 100),
      reblogsCount: Math.floor(Math.random() * 200),
      favouritesCount: Math.floor(Math.random() * 500),
      reblogged: Math.random() > 0.8,
      favourited: Math.random() > 0.7,
      bookmarked: Math.random() > 0.9,
      muted: false,
      pinned: false,
      mediaAttachments: i % 3 === 0 ? [
        {
          id: `media-${i}`,
          type: 'image',
          url: `https://via.placeholder.com/600x400?text=Image+${i}`,
          previewUrl: `https://via.placeholder.com/300x200?text=Preview+${i}`,
          description: `Image description for status ${i}`
        }
      ] : [],
      mentions: [
        {
          id: '1',
          username: 'alice',
          acct: 'alice@mastodon.social',
          url: 'https://mastodon.social/@alice'
        }
      ],
      tags: [
        {
          name: 'hashtag',
          url: 'https://mastodon.social/tags/hashtag'
        }
      ],
      spoilerText: i % 5 === 0 ? 'Content warning: Spoiler text' : undefined
    };

    // Add some boosts
    if (i % 4 === 0) {
      status.reblog = {
        ...mockStatus,
        id: `reblog-${i}`,
        account: {
          ...mockAccount,
          id: `original-${i}`,
          username: `original${i}`,
          displayName: `Original User ${i}`
        }
      };
    }

    statuses.push(status);
  }

  return statuses;
}

export function generateMockNotifications(count: number): Notification[] {
  const notifications: Notification[] = [];
  const types: Array<Notification['type']> = [
    'mention', 'reblog', 'favourite', 'follow', 'follow_request', 
    'poll', 'status', 'update'
  ];

  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    const account: Account = {
      id: `notif-user-${i}`,
      username: `notifuser${i}`,
      acct: `notifuser${i}@mastodon.social`,
      displayName: `Notification User ${i}`,
      avatar: `https://via.placeholder.com/48?text=N${i}`,
      url: `https://mastodon.social/@notifuser${i}`,
      followersCount: Math.floor(Math.random() * 1000),
      followingCount: Math.floor(Math.random() * 500),
      statusesCount: Math.floor(Math.random() * 2000),
      bot: false,
      locked: Math.random() > 0.9,
      verified: Math.random() > 0.8,
      createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString()
    };

    const baseNotification = {
      id: `notification-${i}`,
      account,
      createdAt: new Date(Date.now() - i * 1800000 - Math.random() * 1800000).toISOString(),
      read: Math.random() > 0.7,
      dismissed: false
    };

    let notification: Notification;

    switch (type) {
      case 'mention':
        notification = {
          ...baseNotification,
          type: 'mention',
          status: {
            id: `mention-status-${i}`,
            uri: `https://mastodon.social/@notifuser${i}/mention-status-${i}`,
            url: `https://mastodon.social/@notifuser${i}/mention-status-${i}`,
            account,
            content: `<p>Hey <a href="/@you">@you</a>, what do you think about this? This is mention content number ${i}.</p>`,
            createdAt: baseNotification.createdAt,
            visibility: 'public' as const,
            repliesCount: Math.floor(Math.random() * 10),
            reblogsCount: Math.floor(Math.random() * 5),
            favouritesCount: Math.floor(Math.random() * 15),
            reblogged: false,
            favourited: false,
            bookmarked: false,
            muted: false,
            pinned: false,
            mediaAttachments: [],
            mentions: [{
              id: 'you',
              username: 'you',
              acct: 'you@mastodon.social',
              url: 'https://mastodon.social/@you'
            }],
            tags: []
          }
        };
        break;

      case 'reblog':
        notification = {
          ...baseNotification,
          type: 'reblog',
          status: {
            id: `reblog-status-${i}`,
            uri: `https://mastodon.social/@you/reblog-status-${i}`,
            url: `https://mastodon.social/@you/reblog-status-${i}`,
            account: mockAccount,
            content: `<p>This is your post that got boosted! Content number ${i}.</p>`,
            createdAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
            visibility: 'public' as const,
            repliesCount: Math.floor(Math.random() * 20),
            reblogsCount: Math.floor(Math.random() * 50),
            favouritesCount: Math.floor(Math.random() * 100),
            reblogged: true,
            favourited: false,
            bookmarked: false,
            muted: false,
            pinned: false,
            mediaAttachments: [],
            mentions: [],
            tags: []
          }
        };
        break;

      case 'favourite':
        notification = {
          ...baseNotification,
          type: 'favourite',
          status: {
            id: `favourite-status-${i}`,
            uri: `https://mastodon.social/@you/favourite-status-${i}`,
            url: `https://mastodon.social/@you/favourite-status-${i}`,
            account: mockAccount,
            content: `<p>This is your post that got favorited! Content number ${i}.</p>`,
            createdAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
            visibility: 'public' as const,
            repliesCount: Math.floor(Math.random() * 15),
            reblogsCount: Math.floor(Math.random() * 30),
            favouritesCount: Math.floor(Math.random() * 80),
            reblogged: false,
            favourited: true,
            bookmarked: false,
            muted: false,
            pinned: false,
            mediaAttachments: [],
            mentions: [],
            tags: []
          }
        };
        break;

      case 'follow':
        notification = {
          ...baseNotification,
          type: 'follow'
        };
        break;

      case 'follow_request':
        notification = {
          ...baseNotification,
          type: 'follow_request'
        };
        break;

      case 'poll':
        notification = {
          ...baseNotification,
          type: 'poll',
          status: {
            id: `poll-status-${i}`,
            uri: `https://mastodon.social/@you/poll-status-${i}`,
            url: `https://mastodon.social/@you/poll-status-${i}`,
            account: mockAccount,
            content: `<p>Your poll has ended! Poll number ${i}.</p>`,
            createdAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
            visibility: 'public' as const,
            repliesCount: 5,
            reblogsCount: 2,
            favouritesCount: 10,
            reblogged: false,
            favourited: false,
            bookmarked: false,
            muted: false,
            pinned: false,
            mediaAttachments: [],
            mentions: [],
            tags: [],
            poll: {
              id: `poll-${i}`,
              expiresAt: new Date(Date.now() - 3600000).toISOString(),
              expired: true,
              multiple: false,
              votesCount: 25,
              votersCount: 25,
              voted: false,
              options: [
                { title: 'Option A', votesCount: 15 },
                { title: 'Option B', votesCount: 10 }
              ]
            }
          }
        };
        break;

      case 'status':
        notification = {
          ...baseNotification,
          type: 'status',
          status: {
            id: `status-notification-${i}`,
            uri: `https://mastodon.social/@notifuser${i}/status-notification-${i}`,
            url: `https://mastodon.social/@notifuser${i}/status-notification-${i}`,
            account,
            content: `<p>New post from someone you follow! Status number ${i}.</p>`,
            createdAt: baseNotification.createdAt,
            visibility: 'public' as const,
            repliesCount: Math.floor(Math.random() * 8),
            reblogsCount: Math.floor(Math.random() * 12),
            favouritesCount: Math.floor(Math.random() * 25),
            reblogged: false,
            favourited: false,
            bookmarked: false,
            muted: false,
            pinned: false,
            mediaAttachments: [],
            mentions: [],
            tags: []
          }
        };
        break;

      case 'update':
        notification = {
          ...baseNotification,
          type: 'update',
          status: {
            id: `update-status-${i}`,
            uri: `https://mastodon.social/@notifuser${i}/update-status-${i}`,
            url: `https://mastodon.social/@notifuser${i}/update-status-${i}`,
            account,
            content: `<p>This post was edited! Updated content number ${i}.</p>`,
            createdAt: new Date(Date.now() - (i + 2) * 3600000).toISOString(),
            editedAt: baseNotification.createdAt,
            visibility: 'public' as const,
            repliesCount: Math.floor(Math.random() * 6),
            reblogsCount: Math.floor(Math.random() * 8),
            favouritesCount: Math.floor(Math.random() * 20),
            reblogged: false,
            favourited: false,
            bookmarked: false,
            muted: false,
            pinned: false,
            mediaAttachments: [],
            mentions: [],
            tags: []
          }
        };
        break;

      default:
        notification = {
          ...baseNotification,
          type: 'follow'
        };
    }

    notifications.push(notification);
  }

  return notifications.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Create grouped notifications for testing
export function generateMockGroupedNotifications(): Notification[] {
  const notifications: Notification[] = [];
  
  // Create a group of 5 people who favorited the same post
  const favoriteStatus: Status = {
    id: 'group-favorite-status',
    uri: 'https://mastodon.social/@you/group-favorite-status',
    url: 'https://mastodon.social/@you/group-favorite-status',
    account: mockAccount,
    content: '<p>This post got multiple favorites!</p>',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    visibility: 'public',
    repliesCount: 5,
    reblogsCount: 3,
    favouritesCount: 15,
    reblogged: false,
    favourited: true,
    bookmarked: false,
    muted: false,
    pinned: false,
    mediaAttachments: [],
    mentions: [],
    tags: []
  };

  for (let i = 0; i < 5; i++) {
    notifications.push({
      id: `group-favorite-${i}`,
      type: 'favourite',
      account: {
        id: `group-user-${i}`,
        username: `groupuser${i}`,
        acct: `groupuser${i}@mastodon.social`,
        displayName: `Group User ${i}`,
        avatar: `https://via.placeholder.com/48?text=G${i}`,
        url: `https://mastodon.social/@groupuser${i}`,
        followersCount: 100 + i * 50,
        followingCount: 80 + i * 20,
        statusesCount: 200 + i * 100,
        bot: false,
        locked: false,
        verified: false,
        createdAt: new Date(Date.now() - (i + 1) * 86400000).toISOString()
      },
      status: favoriteStatus,
      createdAt: new Date(Date.now() - i * 600000).toISOString(),
      read: i < 2,
      dismissed: false
    });
  }

  // Create a group of follow notifications
  for (let i = 0; i < 3; i++) {
    notifications.push({
      id: `group-follow-${i}`,
      type: 'follow',
      account: {
        id: `follow-user-${i}`,
        username: `followuser${i}`,
        acct: `followuser${i}@mastodon.social`,
        displayName: `Follow User ${i}`,
        avatar: `https://via.placeholder.com/48?text=F${i}`,
        url: `https://mastodon.social/@followuser${i}`,
        followersCount: 50 + i * 25,
        followingCount: 40 + i * 10,
        statusesCount: 150 + i * 75,
        bot: false,
        locked: false,
        verified: i === 1,
        createdAt: new Date(Date.now() - (i + 1) * 86400000).toISOString()
      },
      createdAt: new Date(Date.now() - (3600000 + i * 300000)).toISOString(),
      read: false,
      dismissed: false
    });
  }

  return notifications.concat(generateMockNotifications(10)).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}