"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Globe } from "lucide-react";
import { useTheme } from "next-themes";

// --- Simple Popup Modal Component ---
function Popup({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </div>
  );
}

// --- Function to send email notification via EmailJS ---
const sendEmailNotification = async (email: string) => {
  // Replace with your own EmailJS configuration values
  const serviceID = "service_0h0o5up";
  const templateID = "template_ar2onik";
  const userID = "Fsf6MnTOyi6GtfvtB";

  const templateParams = {
    to_email: email,
    message: "Air quality alert: The current AQI is above 150.",
  };

  try {
    const response = await emailjs.send(
      serviceID,
      templateID,
      templateParams,
      userID
    );
    console.log("Email sent successfully", response.status);
    return true;
  } catch (error) {
    console.error("Email sending failed", error);
    return false;
  }
};

export default function SettingsPage() {
  // Unconditional hooks
  const { theme, setTheme } = useTheme();

  // Mount check to prevent hydration issues.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Notification states
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [email, setEmail] = useState("");

  // Popup state for notifications
  const [showPushPopup, setShowPushPopup] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);

  // Flag to ensure push notification is sent only once.
  const [pushNotificationSent, setPushNotificationSent] = useState(false);

  // Ref to detect when emailEnabled toggles from false to true.
  const prevEmailEnabled = useRef(false);

  // Simulated current AQI value (replace with your actual AQI data)
  const currentAQI = 160;

  // Effect: Trigger push notification once if conditions met.
  useEffect(() => {
    if (currentAQI > 150 && pushEnabled && !pushNotificationSent) {
      setShowPushPopup(true);
      setPushNotificationSent(true);
    }
  }, [currentAQI, pushEnabled, pushNotificationSent]);

  // Effect: Trigger email notification when emailEnabled toggles on.
  useEffect(() => {
    if (
      !prevEmailEnabled.current && // was previously off
      emailEnabled && // now turned on
      currentAQI > 150 &&
      email.trim() !== ""
    ) {
      sendEmailNotification(email).then((success) => {
        if (success) {
          setShowEmailPopup(true);
        }
      });
    }
    prevEmailEnabled.current = emailEnabled;
  }, [emailEnabled, email, currentAQI]);

  // Handler for the "Check" button to force send an email notification.
  const handleCheckEmail = () => {
    if (email.trim() !== "") {
      sendEmailNotification(email).then((success) => {
        if (success) {
          setShowEmailPopup(true);
        }
      });
    } else {
      alert("Please enter a valid email address.");
    }
  };

  if (!mounted) return null;

  const handleSave = () => {
    alert("Settings saved successfully.");
  };

  return (
    <div className="container mx-auto p-4">
      {showPushPopup && (
        <Popup
          title="Push Notification"
          message="Alert: Air quality is unhealthy in your area."
          onClose={() => setShowPushPopup(false)}
        />
      )}
      {showEmailPopup && (
        <Popup
          title="Email Notification"
          message={`An alert has been sent to ${email}.`}
          onClose={() => setShowEmailPopup(false)}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="space-y-6">
          {/* --- Notifications Section --- */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts about air quality if AQI &gt; 150.
                  </p>
                </div>
                <Switch
                  checked={pushEnabled}
                  onCheckedChange={(value) => setPushEnabled(value)}
                />
              </div>
              {/* Email Updates */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get daily air quality reports if AQI &gt; 150.
                    </p>
                  </div>
                  <Switch
                    checked={emailEnabled}
                    onCheckedChange={(value) => setEmailEnabled(value)}
                  />
                </div>
                {emailEnabled && (
                  <div className="mt-2 flex flex-col gap-2">
                    <Input
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                      onClick={handleCheckEmail}
                      className="w-full"
                      disabled={!email.trim()}
                    >
                      Check
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* --- Appearance Section --- */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred theme.
                  </p>
                </div>
                <Select defaultValue={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>

          {/* --- Learn More About Air Pollutants Section --- */}
          <Card className="p-4 shadow">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Learn More About Air Pollutants
              </h2>
              <p className="text-gray-600">
                Air pollution poses a grave risk to public health. Globally,
                nearly 4.2 million deaths are linked to ambient or outdoor air
                pollution, mainly from heart disease, stroke, chronic
                obstructive pulmonary disease, lung cancer, and acute
                respiratory infections. Explore the pollutants below.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
              {/* Pollutant 1: Particulate Matter */}
              <div className="rounded-md border border-gray-200 bg-purple-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-purple-900">
                  Particulate Matter 2.5 &amp; 10
                </h3>
                <p className="text-sm text-gray-700">
                  Inhalable particulates from dust, fire smoke, and vehicle
                  emissions.
                </p>
              </div>
              {/* Pollutant 2: Nitrogen Dioxide */}
              <div className="rounded-md border border-gray-200 bg-orange-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-orange-900">
                  Nitrogen Dioxide
                </h3>
                <p className="text-sm text-gray-700">
                  Emitted by vehicles and industries, contributing to ozone
                  formation.
                </p>
              </div>
              {/* Pollutant 3: Carbon Monoxide */}
              <div className="rounded-md border border-gray-200 bg-blue-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-blue-900">
                  Carbon Monoxide
                </h3>
                <p className="text-sm text-gray-700">
                  A colorless gas produced by incomplete combustion of fossil
                  fuels.
                </p>
              </div>
              {/* Pollutant 4: Sulfur Dioxide */}
              <div className="rounded-md border border-gray-200 bg-green-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-green-900">
                  Sulfur Dioxide
                </h3>
                <p className="text-sm text-gray-700">
                  Generated by burning fossil fuels, it can irritate the
                  respiratory system.
                </p>
              </div>
              {/* Pollutant 5: Ozone */}
              <div className="rounded-md border border-gray-200 bg-pink-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-pink-900">
                  Ozone (O<sub>3</sub>)
                </h3>
                <p className="text-sm text-gray-700">
                  A key component of smog formed by reactions between
                  pollutants.
                </p>
              </div>
              {/* Pollutant 6: Lead */}
              <div className="rounded-md border border-gray-200 bg-yellow-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-yellow-900">
                  Lead
                </h3>
                <p className="text-sm text-gray-700">
                  A toxic metal with severe effects on the nervous system.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
