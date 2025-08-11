import { makeGmailLink } from "@/lib/utils";
import { Home, BookOpen, Users, Repeat } from "lucide-react";

export const NavigationLinks = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Books",
    url: "/books",
    icon: BookOpen,
  },
  {
    title: "Students",
    url: "/students",
    icon: Users,
  },
  {
    title: "Lending & Returns",
    url: "/lending-returns",
    icon: Repeat,
  },
];

export const SecondaryLinks = [
  {
    title: "Contact",
    url: makeGmailLink("Contact", "Hello, I would like to contact you."),
  },
  {
    title: "Help",
    url: makeGmailLink("Help", "Hello, I need some help."),
  },
];
export const schoolName = "Tiza";
