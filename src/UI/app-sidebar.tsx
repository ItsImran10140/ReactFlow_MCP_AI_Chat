"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/UI/nav-main";
import { NavProjects } from "@/UI/nav-projects";
import { NavUser } from "@/UI/nav-user";
import { TeamSwitcher } from "@/UI/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/UI/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Imran Shah",
    email: "imran@example.com",
    avatar: "/prof.png",
  },
  teams: [
    {
      name: "VectorShift",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Personal",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Business",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Logic",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Pipelines",
          url: "#",
        },
        {
          title: "Agents",
          url: "#",
        },
        {
          title: "Transformations",
          url: "#",
        },
      ],
    },
    {
      title: "Data",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Knowledge Bases",
          url: "#",
        },
        {
          title: "Tables",
          url: "#",
        },
        {
          title: "Files",
          url: "#",
        },
      ],
    },
    {
      title: "Interfaces",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Chatbots",
          url: "#",
        },
        {
          title: "Search",
          url: "#",
        },
        {
          title: "Forms",
          url: "#",
        },
        {
          title: "Voicebots",
          url: "#",
        },
        {
          title: "Bulkjobs",
          url: "#",
        },
        {
          title: "Portals",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Analytics",
      url: "#",
      icon: Frame,
    },
    {
      name: "Playground",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Evaluators",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
