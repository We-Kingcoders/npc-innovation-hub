export interface Project {
  id: number;
  title: string;
  description: string;
  owner: string;
  ownerRole: string;
  ownerAvatar: string;
  image: string;
  link: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Music festival management",
    description:
      "Jorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    owner: "Kamana Felcien",
    ownerRole: "Project owner",
    ownerAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
    image:
      "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    link: "#",
  },
  {
    id: 2,
    title: "E-commerce Website",
    description:
      "Jorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    owner: "Kamana Felcien",
    ownerRole: "Project owner",
    ownerAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
    image:
      "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "#",
  },
  {
    id: 3,
    title: "Social Media Platform",
    description:
      "Jorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    owner: "Kamana Felcien",
    ownerRole: "Project owner",
    ownerAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
    image:
      "https://images.pexels.com/photos/159435/instagram-tablet-device-technology-159435.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "#",
  },
  {
    id: 4,
    title: "Collaboration tool",
    description:
      "Jorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    owner: "Kamana Felcien",
    ownerRole: "Project owner",
    ownerAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
    image:
      "https://images.pexels.com/photos/8284724/pexels-photo-8284724.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "#",
  },
  {
    id: 5,
    title: "e-Learning Platform",
    description:
      "Jorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    owner: "Kamana Felcien",
    ownerRole: "Project owner",
    ownerAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
    image:
      "https://images.pexels.com/photos/7013241/pexels-photo-7013241.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "#",
  },
  {
    id: 6,
    title: "Job Board Website",
    description:
      "Jorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    owner: "Kamana Felcien",
    ownerRole: "Project owner",
    ownerAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    link: "#",
  },
  {
    id: 7,
    title: "Music festival management",
    description:
      "Jorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    owner: "Kamana Felcien",
    ownerRole: "Project owner",
    ownerAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
    image:
      "https://media.istockphoto.com/id/1371319562/photo/blue-bus-moving-on-the-road-in-city-in-early-morning.jpg?b=1&s=612x612&w=0&k=20&c=ieKSvpjdU8fETtl5lLmKxBYmn9sCiM1bzixpSq4tOic=",
    link: "#",
  },
];

export const featuredProject: Project = {
  title: "Music festival management",
  description:
    "Jorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
  owner: "NPC HUB",
  ownerRole: "Project owner",
  ownerAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
  image:
    "https://media.istockphoto.com/id/1371319562/photo/blue-bus-moving-on-the-road-in-city-in-early-morning.jpg?b=1&s=612x612&w=0&k=20&c=ieKSvpjdU8fETtl5lLmKxBYmn9sCiM1bzixpSq4tOic=",
  link: "#",
  id: 3,
};

export const allProjects: Project[] = [...projects];
