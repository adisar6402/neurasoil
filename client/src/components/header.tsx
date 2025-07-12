import { Sprout, WifiOff, User } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-2 md:py-0 gap-2 md:gap-0">
          {/* Left Section: Logo + Tagline */}
          <div className="flex flex-col md:flex-row items-center md:space-x-4 text-center md:text-left">
            <div className="flex items-center space-x-2">
              <Sprout className="text-forest-green text-2xl" />
              <h1 className="text-2xl font-bold text-charcoal">NeuraSoil</h1>
            </div>
            <span className="text-sm text-gray-500">AI-Powered Soil Prediction System</span>
          </div>

          {/* Right Section: Status + User */}
          <div className="flex flex-col md:flex-row items-center md:space-x-4 text-center md:text-right">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <WifiOff className="w-4 h-4" />
              <span>Offline Mode</span>
            </div>
            <div className="flex items-center space-x-2 mt-1 md:mt-0">
              <div className="w-8 h-8 bg-forest-green rounded-full flex items-center justify-center">
                <User className="text-white text-sm" />
              </div>
              <span className="text-sm font-medium text-charcoal">Farmer Dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
