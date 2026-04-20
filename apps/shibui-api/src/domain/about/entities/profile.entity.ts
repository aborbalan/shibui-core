export class SocialLink {
  label: string;
  url: string;
}

export class Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  bio: string;
  socials: SocialLink[];
}
