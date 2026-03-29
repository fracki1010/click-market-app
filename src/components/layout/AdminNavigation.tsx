import { AdminMoreMenu } from "./admin-navigation/components/AdminMoreMenu";
import { AdminNavLink } from "./admin-navigation/components/AdminNavLink";
import { useAdminNavigationItems } from "./admin-navigation/hooks/useAdminNavigationItems";

export const AdminNavigation = () => {
  const { primaryNavItems, secondaryNavItems, isSecondaryActive } =
    useAdminNavigationItems();

  return (
    <nav className="pb-safe fixed bottom-0 left-0 right-0 z-50 flex h-[var(--app-bottom-nav-height)] items-center justify-between border-t border-divider bg-background/90 px-4 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] backdrop-blur-lg transition-colors md:hidden">
      {primaryNavItems.map((item) => (
        <AdminNavLink key={item.to} item={item} />
      ))}
      <AdminMoreMenu isActive={isSecondaryActive} items={secondaryNavItems} />
    </nav>
  );
};
