export type HireRequest = {
  id: number;
  title: string;
  message: string;
  time: string;
  imageUrl: string;
};

export const hireRequests: HireRequest[] = [
  {
    id: 1,
    title: "You have hired by KPMG company",
    message: "You’ve been hired. We’re excited to have you on board!",
    time: "10:30 Am",
    imageUrl: "/avatar1.png",
  },
  {
    id: 2,
    title: "You have hired by KPMG company",
    message: "You’ve been hired. We’re excited to have you on board!",
    time: "10:30 Am",
    imageUrl: "/avatar2.png",
  },
  {
    id: 3,
    title: "You have hired by KPMG company",
    message: "You’ve been hired. We’re excited to have you on board!",
    time: "10:30 Am",
    imageUrl: "/avatar3.png",
  },
];
