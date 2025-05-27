
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, UserCircle, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [criticalAlertsOnly, setCriticalAlertsOnly] = React.useState(false);
  const [displayName, setDisplayName] = React.useState("Demo User");

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Settings className="mr-3 h-7 w-7 text-primary" />
            Application Settings
          </CardTitle>
          <CardDescription>
            Manage your BlockArmor preferences and configurations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Settings */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center"><UserCircle className="mr-2 h-6 w-6 text-muted-foreground"/>Profile</h3>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input 
                id="displayName" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="user@example.com" disabled />
            </div>
            <Button onClick={() => console.log("Profile update clicked. Name:", displayName)}>Update Profile</Button>
          </section>

          <Separator />

          {/* Notification Settings */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center"><Bell className="mr-2 h-6 w-6 text-muted-foreground"/>Notifications</h3>
            <div className="flex items-center justify-between space-x-2 p-3 rounded-md border">
              <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
                <span>Email Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Receive important alerts and updates via email.
                </span>
              </Label>
              <Switch 
                id="emailNotifications" 
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between space-x-2 p-3 rounded-md border">
              <Label htmlFor="criticalAlerts" className="flex flex-col space-y-1">
                <span>Critical Alerts Only</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Only notify for critical severity security events.
                </span>
              </Label>
              <Switch 
                id="criticalAlerts" 
                checked={criticalAlertsOnly}
                onCheckedChange={setCriticalAlertsOnly}
                disabled={!emailNotifications} // Example: disable if email notifications are off
              />
            </div>
          </section>
          
          <Separator />

          {/* Security Settings */}
           <section className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center"><Shield className="mr-2 h-6 w-6 text-muted-foreground"/>Security</h3>
            <div className="flex items-center justify-between space-x-2 p-3 rounded-md border">
              <Label htmlFor="twoFactorAuth" className="flex flex-col space-y-1">
                <span>Two-Factor Authentication (2FA)</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Enhance your account security.
                </span>
              </Label>
              <Button variant="outline" size="sm" onClick={() => console.log("Enable 2FA clicked")}>Enable 2FA</Button>
            </div>
             <div className="space-y-2">
              <Label htmlFor="apiToken">API Token</Label>
              <div className="flex items-center gap-2">
                <Input id="apiToken" type="password" defaultValue="************" disabled />
                <Button variant="secondary" onClick={() => console.log("Regenerate API token clicked")}>Regenerate</Button>
              </div>
            </div>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
