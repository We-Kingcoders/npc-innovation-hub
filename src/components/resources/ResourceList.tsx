import React from "react";
//import LikeIcon from "./LikeIcon";

export const resources = [
  {
    id: 1,
    icon: "https://play-lh.googleusercontent.com/hoVBnPBRehmXsCqESLXRH2E3OTxklkwKZlb1psn7imm0VUSobn2nevS9RRFWb9GM4-o",
    title: "Essentials for figma beginners",
    subcategory: "UI/UX Design",
    likes: 200,
    views: 200,
  },
  {
    id: 2,
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLjjCqpT9yFoRs4odDSt__6-0MDmq7q-VvmA&s",
    title: "Kubernetes 101",
    subcategory: "DevOps & Deployment",
    likes: 180,
    views: 150,
  },
  {
    id: 3,
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLuowUjaOWu7gD__sbISQai7nzr6j8gL4x2Q&s",
    title: "React UI Kit",
    subcategory: "UI Libraries & Frameworks",
    likes: 150,
    views: 210,
  },
  {
    id: 4,
    icon: "https://images.icon-icons.com/2415/PNG/512/mongodb_original_wordmark_logo_icon_146425.png",
    title: "MongoDB Basics",
    subcategory: "Database Integration",
    likes: 140,
    views: 120,
  },
  {
    id: 5,
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJH65M2lbWisGxCCZh9Ib5jTq41HXBv2nRKg&s",
    title: "JWT Authentication Explained",
    subcategory: "Authentication & Authorization",
    likes: 130,
    views: 100,
  },
  {
    id: 6,
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJgxMhCSoNdFagVeph-s38pIJTKYygdsDNfA&s",
    title: "Web Performance Optimization",
    subcategory: "Performance Optimization",
    likes: 115,
    views: 90,
  },
  {
    id: 7,
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPOmI4LVMegtKOXAuyrSGcPau87SguZ53QiA&s",
    title: "Serverless Framework Guide",
    subcategory: "Server Frameworks",
    likes: 100,
    views: 85,
  },
  {
    id: 8,
    icon: "https://cdn.iconscout.com/icon/premium/png-256-thumb/error-management-2411063-2024965.png",
    title: "Error Handling Patterns",
    subcategory: "Error Handling & Logging",
    likes: 90,
    views: 80,
  },
  // Add more unique examples as needed
];

interface Props {
  title?: string;
}

const ResourceList: React.FC<Props> = ({ title }) => {
  // Just show top 10 most liked, without duplication by title
  const uniqueResources = Array.from(
    new Map(resources.map((r) => [r.title, r])).values(),
  ).slice(0, 10);

  // Split into 2 columns
  const mid = Math.ceil(uniqueResources.length / 2);
  const columns = [uniqueResources.slice(0, mid), uniqueResources.slice(mid)];

  return (
    <div>
      {title && <h3 className="text-xl font-bold text-center mb-6">{title}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {columns.map((col, idx) => (
          <ul key={idx} className="space-y-3">
            {col.map((res) => (
              <li
                key={res.id}
                className="flex items-center gap-3 border-b last:border-b-0 pb-2"
              >
                <img src={res.icon} alt={res.title} className="w-6 h-6" />
                <span className="text-base">{res.title}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

export default ResourceList;
