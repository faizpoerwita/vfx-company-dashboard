import { MovingBorder } from "@/components/ui/moving-border";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { HoverEffect } from "@/components/ui/card";
import { IconBell, IconLock, IconPalette, IconUser } from "@tabler/icons-react";

const settingsCategories = [
  {
    title: "Profile Settings",
    description: "Update your personal information and preferences",
    icon: <IconUser className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "Appearance",
    description: "Customize the look and feel of your dashboard",
    icon: <IconPalette className="h-6 w-6 text-purple-500" />,
  },
  {
    title: "Notifications",
    description: "Configure your notification preferences",
    icon: <IconBell className="h-6 w-6 text-emerald-500" />,
  },
  {
    title: "Security",
    description: "Manage your security settings and permissions",
    icon: <IconLock className="h-6 w-6 text-amber-500" />,
  },
];

const Settings = () => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <MovingBorder duration={3000} className="self-start p-[1px]">
          <BackgroundGradient className="rounded-lg p-4 bg-black">
            <h1 className="text-2xl font-bold text-neutral-200">
              Settings
            </h1>
          </BackgroundGradient>
        </MovingBorder>
      </div>

      {/* Settings Categories */}
      <div>
        <HoverEffect 
          items={settingsCategories}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        />
      </div>

      {/* Preferences */}
      <BackgroundGradient className="rounded-2xl bg-black p-6">
        <h2 className="text-xl font-semibold text-neutral-200 mb-4">Quick Preferences</h2>
        <div className="space-y-4">
          {[
            { name: "Dark Mode", enabled: true },
            { name: "Email Notifications", enabled: true },
            { name: "Desktop Notifications", enabled: false },
            { name: "Auto-save", enabled: true },
          ].map((setting) => (
            <div key={setting.name} className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/50">
              <span className="text-neutral-200">{setting.name}</span>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  setting.enabled ? 'bg-indigo-600' : 'bg-neutral-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    setting.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </BackgroundGradient>

      {/* Account Information */}
      <BackgroundGradient className="rounded-2xl bg-black p-6">
        <h2 className="text-xl font-semibold text-neutral-200 mb-4">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-neutral-900/50">
            <p className="text-sm text-neutral-400">Email</p>
            <p className="text-neutral-200">user@example.com</p>
          </div>
          <div className="p-4 rounded-lg bg-neutral-900/50">
            <p className="text-sm text-neutral-400">Role</p>
            <p className="text-neutral-200">Administrator</p>
          </div>
          <div className="p-4 rounded-lg bg-neutral-900/50">
            <p className="text-sm text-neutral-400">Last Login</p>
            <p className="text-neutral-200">2 hours ago</p>
          </div>
          <div className="p-4 rounded-lg bg-neutral-900/50">
            <p className="text-sm text-neutral-400">Two-Factor Auth</p>
            <p className="text-neutral-200">Enabled</p>
          </div>
        </div>
      </BackgroundGradient>
    </div>
  );
};

export default Settings;
