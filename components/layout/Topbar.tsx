"use client";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { UserButton, useAuth, ClerkLoading } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const Topbar = () => {
  const { userId } = useAuth();
  const topRoutes = [
    {
      label: "Instructor",
      path: "/instructor/courses",
    },
    {
      label: "Learning",
      path: "/learning",
    },
  ];
  return (
    <div className="flex justify-between items-center border-b p-4">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="logo"
          width={200}
          height={100}
          className="cursor-pointer"
        />
      </Link>

      <div className="max-md:hidden flex md:w-[400px] rounded-full">
        <input
          className="flex-grow bg-[#FFF8EB] rounded-l-full border-none outline-none text-sm pl-4 py-3"
          placeholder="Search for Courses"
        />
        <button className="bg-[#FDAB04] border-none outline-none cursor-pointer px-4 py-3 rounded-r-full hover:bg-[#FDAB04]/80">
          <Search className="size-4" />
        </button>
      </div>

      <div className="flex gap-6 items-center">
        <div className="max-sm:hidden flex gap-6">
          {topRoutes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className="text-sm font-medium transition hover:text-[#FDAB04]"
            >
              {route.label}
            </Link>
          ))}
        </div>
        <ClerkLoading>
          <Loader2 className="w-6 h-6 animate-spin" />
        </ClerkLoading>
        {userId ? (
          <UserButton afterSignOutUrl="/sign-in" />
        ) : (
          <Link href="/sign-in">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Topbar;
