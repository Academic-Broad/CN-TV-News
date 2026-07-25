export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
}

export const authors: Author[] = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    bio: "Senior Technology Correspondent with over 15 years covering Silicon Valley and global tech innovation.",
  },
  {
    id: "james-mitchell",
    name: "James Mitchell",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    bio: "International Affairs Editor specializing in geopolitics and diplomatic relations.",
  },
  {
    id: "maria-rodriguez",
    name: "Maria Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    bio: "Science and Environment reporter covering climate change and breakthrough discoveries.",
  },
  {
    id: "david-park",
    name: "David Park",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    bio: "Business and Finance editor tracking global markets and economic trends.",
  },
  {
    id: "emma-thompson",
    name: "Emma Thompson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    bio: "Lifestyle and Culture writer covering wellness, travel, and contemporary living.",
  },
  {
    id: "alex-johnson",
    name: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    bio: "Political Correspondent covering domestic policy and elections.",
  },
];
