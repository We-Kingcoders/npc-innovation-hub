export type DashboardStat = {
  label: string;
  value: number | string;
};

export async function fetchDashboardStats(): Promise<DashboardStat[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token found");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const userPromise = fetch("http://localhost:5000/api/users/users", {
    headers,
  }).then(async (res) => {
    if (!res.ok) throw new Error("User API request failed");
    const data = await res.json();
    if (Array.isArray(data?.data?.users)) return data.data.users.length;
    throw new Error("Malformed User API response");
  });

  const projectPromise = fetch("http://localhost:5000/api/projects", {
    headers,
  }).then(async (res) => {
    if (!res.ok) throw new Error("Project API request failed");
    const data = await res.json();
    if (Array.isArray(data?.data?.projects)) return data.data.projects.length;
    throw new Error("Malformed Project API response");
  });

  const resourcePromise = fetch("http://localhost:5000/api/resources", {
    headers,
  }).then(async (res) => {
    if (!res.ok) throw new Error("Resource API request failed");
    const data = await res.json();
    if (Array.isArray(data?.data?.resources)) return data.data.resources.length;
    throw new Error("Malformed Resource API response");
  });

  const blogPromise = fetch("http://localhost:5000/api/blogs", {
    headers,
  }).then(async (res) => {
    if (!res.ok) throw new Error("Blog API request failed");
    const data = await res.json();
    if (Array.isArray(data?.data?.blogs)) return data.data.blogs.length;
    throw new Error("Malformed Blog API response");
  });

  const inquiryPromise = fetch(
    "http://localhost:5000/api/admin/hire-inquiries",
    { headers },
  ).then(async (res) => {
    if (!res.ok) throw new Error("Hire Inquiries API request failed");
    const data = await res.json();
    if (Array.isArray(data?.data?.inquiries)) return data.data.inquiries.length;
    throw new Error("Malformed Hire Inquiries API response");
  });

  const taskPromise = fetch("http://localhost:5000/tasks", { headers }).then(
    async (res) => {
      if (!res.ok) throw new Error("Tasks API request failed");
      const data = await res.json();
      if (Array.isArray(data)) return data.length;
      throw new Error("Malformed Tasks API response");
    },
  );

  const [
    usersCount,
    projectsCount,
    resourcesCount,
    blogsCount,
    inquiriesCount,
    tasksCount,
  ] = await Promise.all([
    userPromise,
    projectPromise,
    resourcePromise,
    blogPromise,
    inquiryPromise,
    taskPromise,
  ]);

  return [
    { label: "Users", value: usersCount },
    { label: "Projects", value: projectsCount },
    { label: "Resources", value: resourcesCount },
    { label: "Blogs", value: blogsCount },
    { label: "Inquiries", value: inquiriesCount },
    { label: "Tasks", value: tasksCount },
  ];
}
