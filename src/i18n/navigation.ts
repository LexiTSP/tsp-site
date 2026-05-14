import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Wrappet Link/redirect/usePathname/useRouter som beholder locale-prefix.
// Bruk disse i stedet for next/link og next/navigation overalt der locale matters.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
