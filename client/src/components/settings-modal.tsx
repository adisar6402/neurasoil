import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Settings, Globe, Bell, Clock, Save } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "yo", name: "Yoruba", flag: "🇳🇬" },
  { code: "ha", name: "Hausa", flag: "🇳🇬" },
  { code: "sw", name: "Swahili", flag: "🇹🇿" },
  { code: "fr", name: "French", flag: "🇫🇷" },
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
    enabled: isOpen,
  });

  const [localSettings, setLocalSettings] = useState({
    language: "en",
    units: "metric",
    alertPreferences: {
      criticalAlerts: true,
      warningAlerts: true,
      infoAlerts: true,
      smsNotifications: true,
    },
    refreshInterval: 30000,
  });

  // Update local settings when server settings load
  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const saveSettingsMutation = useMutation({
    mutationFn: (newSettings: any) => apiRequest("POST", "/api/settings", newSettings),
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    saveSettingsMutation.mutate(localSettings);
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === localSettings.language) || languages[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Language & Region</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Display Language</Label>
                <Select 
                  value={localSettings.language} 
                  onValueChange={(value) => setLocalSettings({...localSettings, language: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language">
                      <span className="flex items-center space-x-2">
                        <span>{getCurrentLanguage().flag}</span>
                        <span>{getCurrentLanguage().name}</span>
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center space-x-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="units">Units</Label>
                <Select 
                  value={localSettings.units} 
                  onValueChange={(value) => setLocalSettings({...localSettings, units: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (°C, cm, kg)</SelectItem>
                    <SelectItem value="imperial">Imperial (°F, in, lbs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alert Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span>Alert Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Critical Alerts</Label>
                  <div className="text-sm text-gray-500">
                    High priority alerts requiring immediate attention
                  </div>
                </div>
                <Switch
                  checked={localSettings.alertPreferences.criticalAlerts}
                  onCheckedChange={(checked) => 
                    setLocalSettings({
                      ...localSettings,
                      alertPreferences: {
                        ...localSettings.alertPreferences,
                        criticalAlerts: checked
                      }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Warning Alerts</Label>
                  <div className="text-sm text-gray-500">
                    Medium priority alerts for monitoring
                  </div>
                </div>
                <Switch
                  checked={localSettings.alertPreferences.warningAlerts}
                  onCheckedChange={(checked) => 
                    setLocalSettings({
                      ...localSettings,
                      alertPreferences: {
                        ...localSettings.alertPreferences,
                        warningAlerts: checked
                      }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Information Alerts</Label>
                  <div className="text-sm text-gray-500">
                    General information and updates
                  </div>
                </div>
                <Switch
                  checked={localSettings.alertPreferences.infoAlerts}
                  onCheckedChange={(checked) => 
                    setLocalSettings({
                      ...localSettings,
                      alertPreferences: {
                        ...localSettings.alertPreferences,
                        infoAlerts: checked
                      }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <div className="text-sm text-gray-500">
                    Send alerts via SMS (offline simulation)
                  </div>
                </div>
                <Switch
                  checked={localSettings.alertPreferences.smsNotifications}
                  onCheckedChange={(checked) => 
                    setLocalSettings({
                      ...localSettings,
                      alertPreferences: {
                        ...localSettings.alertPreferences,
                        smsNotifications: checked
                      }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>System Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="refresh">Auto-refresh Interval</Label>
                <Select 
                  value={localSettings.refreshInterval.toString()} 
                  onValueChange={(value) => setLocalSettings({...localSettings, refreshInterval: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15000">15 seconds</SelectItem>
                    <SelectItem value="30000">30 seconds</SelectItem>
                    <SelectItem value="60000">1 minute</SelectItem>
                    <SelectItem value="300000">5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline">Offline Mode</Badge>
                  <span className="text-sm font-medium">System Status</span>
                </div>
                <p className="text-sm text-blue-800">
                  NeuraSoil is running in offline mode. All data is stored locally and 
                  predictions are generated using edge AI models.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saveSettingsMutation.isPending}
              className="bg-forest-green hover:bg-green-600"
            >
              {saveSettingsMutation.isPending ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}