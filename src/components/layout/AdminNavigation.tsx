import { AdminMoreMenu } from "./admin-navigation/components/AdminMoreMenu";
import { AdminNavLink } from "./admin-navigation/components/AdminNavLink";
import { useAdminNavigationItems } from "./admin-navigation/hooks/useAdminNavigationItems";

export const AdminNavigation = () => {
  const { primaryNavItems, secondaryNavItems, isSecondaryActive } =
    useAdminNavigationItems();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-divider flex justify-between items-center px-4 py-3 z-50 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)] transition-colors">
      {primaryNavItems.map((item) => (
        <AdminNavLink key={item.to} item={item} />
      ))}
      <AdminMoreMenu isActive={isSecondaryActive} items={secondaryNavItems} />
    </nav>
  );
};
