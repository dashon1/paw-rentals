
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Heart, Plus, User, Search, PawPrint, MessageSquare, FileText, Bell } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Search Rentals",
    url: createPageUrl("Search"),
    icon: Search,
  },
  {
    title: "My Favorites", 
    url: createPageUrl("Favorites"),
    icon: Heart,
  },
  {
    title: "Post Listing",
    url: createPageUrl("PostListing"),
    icon: Plus,
  },
  {
    title: "Messages",
    url: createPageUrl("Messages"),
    icon: MessageSquare,
  },
  {
    title: "My Applications",
    url: createPageUrl("Applications"),
    icon: FileText,
  },
  {
    title: "Pet Profiles",
    url: createPageUrl("PetProfiles"),
    icon: PawPrint,
  },
  {
    title: "My Account",
    url: createPageUrl("Account"),
    icon: User,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-orange-50">
        <Sidebar className="border-r border-orange-200 bg-white">
          <SidebarHeader className="border-b border-orange-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">PawRentals</h2>
                <p className="text-xs text-orange-600 font-medium">Pet-Friendly Housing</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-orange-100 hover:text-orange-700 transition-all duration-200 rounded-xl px-4 py-3 ${
                          location.pathname === item.url ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">
                Quick Tips
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                  <div className="flex items-start gap-3">
                    <PawPrint className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-800">Find Your Perfect Home</p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Search pet-friendly rentals with transparent pet policies and connect directly with landlords.
                      </p>
                    </div>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-orange-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">Pet Owner</p>
                <p className="text-xs text-gray-500 truncate">Find your perfect home</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          {/* Mobile header */}
          <header className="bg-white border-b border-orange-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-orange-100 p-2 rounded-lg transition-colors duration-200" />
              <div className="flex items-center gap-2">
                <PawPrint className="w-6 h-6 text-orange-500" />
                <h1 className="text-lg font-bold text-gray-900">PawRentals</h1>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
