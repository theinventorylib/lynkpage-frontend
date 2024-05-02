// ~/types/index.d.ts

export {
  LinkInterface,
  SkillInterface,
  UserPayloadInterface,
  CategoryInterface,
  DisplayItem,
  CustomItem,
  SocialLinkItem,
  UserInterface,
  UserDisplayInterface,
};

declare global {
  interface UserInterface {
    username: string;
    full_name: string;
    image: string;
    thumbnail: string;
    occupation: string;
    skills: SkillInterface[];
    social_links: SocialLinkItem[];
    location: string;
    email: string;
    about: string;
    is_premium: boolean;
    theme_name: string;
    social_link_count: number;
    skill_count: number;
    category_count: number;
    item_count: number;
  }
  interface UserDisplayInterface {
    username: string;
    full_name: string;
    image: string;
    thumbnail: string;
    occupation: string;
    skills: SkillInterface[];
    social_links: SocialLinkItem[];
    location: string;
    email: string;
    about: string;
    theme_name: string;
    is_premium: boolean;
    user_data: DisplayItem[];
  }
  interface SkillInterface {
    id: number;
    name: string;
  }
  interface UserPayloadInterface {
    username: string;
    password: string;
  }
  interface CategoryInterface {
    id: number;
    name: string;
    user: number;
  }
  interface CustomItem {
    id: number;
    user: number;
    category: string;
    title: string;
    embeded_item: boolean;
    image: string;
    link: string;
  }
  interface DisplayItem {
    id: number;
    name: string;
    user: number;
    data: CustomItem[];
  }
  interface SocialLinkItem {
    id: number;
    user: number;
    name: string;
    link: string;
    display: boolean;
  }
  // interface PersonalUDataInterface {}
}
