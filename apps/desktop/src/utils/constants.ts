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

export const GRADES = [
  { value: "P1", label: "Primary 1" },
  { value: "P2", label: "Primary 2" },
  { value: "P3", label: "Primary 3" },
  { value: "P4", label: "Primary 4" },
  { value: "P5", label: "Primary 5" },
  { value: "P6", label: "Primary 6" },
  { value: "S1", label: "Senior 1" },
  { value: "S2", label: "Senior 2" },
  { value: "S3", label: "Senior 3" },
  { value: "S4", label: "Senior 4" },
  { value: "S5", label: "Senior 5" },
  { value: "S6", label: "Senior 6" },
];
