import { Link, useLocation } from "wouter";
import { BarChart3, Bell, Clock, LayoutDashboard } from "lucide-react";

const tabs = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Predictions", href: "/predictions", icon: BarChart3 },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "History", href: "/history", icon: Clock },
];

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = location === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center space-x-2 px-1 py-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                  isActive
                    ? "border-forest-green text-forest-green"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
