import { Settings, User, Bell, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const sections = [
    {
      icon: User,
      title: "Profile",
      description: "Manage your admin account details",
      status: "Active",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Configure email and push notification preferences",
      status: "Enabled",
    },
    {
      icon: Globe,
      title: "Site Settings",
      description: "General site configuration and branding",
      status: "Default",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your dashboard and site preferences
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.title} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <section.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <Badge variant="secondary">{section.status}</Badge>
              </div>
              <CardTitle className="text-base">{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Version</dt>
              <dd className="text-sm font-medium">1.0.0</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Framework</dt>
              <dd className="text-sm font-medium">Next.js 15 (App Router)</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Database</dt>
              <dd className="text-sm font-medium">Mock DB (In-Memory)</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Last Updated</dt>
              <dd className="text-sm font-medium">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
