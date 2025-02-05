import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useAuth } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const InstructorLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }
  return (
    <div className="h-full flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default InstructorLayout;
