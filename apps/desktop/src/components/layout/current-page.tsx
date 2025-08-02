import { Link, useRouterState } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

export function CurrentPage() {
  const router = useRouterState();
  const pathname = router.location.pathname;

  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const formattedSegment =
        segment.charAt(0).toUpperCase() + segment.slice(1);

      return (
        <Fragment key={segment.toString()}>
          <BreadcrumbItem key={href}>
            <BreadcrumbLink asChild>
              <Link to={href}>{formattedSegment}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {segments.length !== index + 1 && <BreadcrumbSeparator />}
        </Fragment>
      );
    });
  };

  return (
    <div className="flex justify-between items-center gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">/</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathname !== "/" && <BreadcrumbSeparator />}
          {generateBreadcrumbs()}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
