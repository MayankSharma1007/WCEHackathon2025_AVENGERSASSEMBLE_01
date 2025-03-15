"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, Wind, Droplets, Thermometer, Mic } from "lucide-react";

// UI Components – ensure these exist in your project.
import { Card } from "@/components/ui/card";
import { HistoricalTrend } from "@/components/historical-trend";
import { useLocation } from "@/components/location-provider";
import { AQIService, AQIData } from "@/lib/api/aqi-service";
import { HealthAdvice } from "@/components/health-advice";
import { ActivitySuggestions } from "@/components/activity-suggestions";
import { PollutantBreakdown } from "@/components/pollutant-breakdown";

// ----- Gemini API Key (Updated) -----
const GEMINI_API_KEY = "AIzaSyCLueqAlrzPqM1vQkcKsvcnriJ-pqbQqJk";

// ----- Inbuilt city AQI function -----
async function getCityAQI(city: string): Promise<string> {
  const dummyData: Record<string, number> = {
    mumbai: 120,
    delhi: 250,
    bangalore: 80,
  };
  const aqi = dummyData[city.toLowerCase()];
  if (aqi !== undefined) {
    const status = getAQIStatus(aqi);
    return `The current AQI in ${city} is ${aqi}. Air quality is ${status.text}.`;
  } else {
    return `No AQI data available for ${city}.`;
  }
}

// ----- Gemini API Response Function -----
async function getGeminiResponse(query: string): Promise<string> {
  const knownCities = ["mumbai", "delhi", "bangalore"];
  const city = knownCities.find((c) => query.toLowerCase().includes(c));
  if (city) {
    return await getCityAQI(city);
  }
  try {
    const prompt = `You are an AI assistant for air quality in India. Answer in one concise sentence (20-25 words max): "${query}"`;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  } catch (error: any) {
    return `Sorry, I couldn't fetch the data due to an error: ${error.message}`;
  }
}

// ----- Helper Function: Get AQI Status -----
const getAQIStatus = (
  aqi: number
): { text: string; color: string; description: string } => {
  if (aqi <= 50)
    return {
      text: "Good",
      color: "#00e400",
      description:
        "Air quality is satisfactory, and air pollution poses little or no risk.",
    };
  if (aqi <= 100)
    return {
      text: "Moderate",
      color: "#ffff00",
      description:
        "Air quality is acceptable. However, there may be a risk for some people.",
    };
  if (aqi <= 150)
    return {
      text: "Unhealthy for Sensitive Groups",
      color: "#ff7e00",
      description: "Members of sensitive groups may experience health effects.",
    };
  if (aqi <= 200)
    return {
      text: "Unhealthy",
      color: "#ff0000",
      description: "Everyone may begin to experience health effects.",
    };
  return {
    text: "Very Unhealthy",
    color: "#99004c",
    description:
      "Health warnings of emergency conditions. Everyone is more likely to be affected.",
  };
};

// ----- SpeechAssistant Component -----
// Provides voice and text-based query functionality.
function SpeechAssistant() {
  const [output, setOutput] = useState("Assistant output will appear here...");
  const [status, setStatus] = useState("");
  const [textInputVisible, setTextInputVisible] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);

  // Setup speech synthesis – select a female voice if available.
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const synth = window.speechSynthesis;
      const selectFemaleVoice = () => {
        const voices = synth.getVoices();
        if (voices && voices.length > 0) {
          const voice =
            voices.find((v: SpeechSynthesisVoice) =>
              v.name.toLowerCase().includes("female")
            ) ||
            voices.find(
              (v: SpeechSynthesisVoice) => v.name === "Google UK English Female"
            ) ||
            voices[0];
          setSelectedVoice(voice);
        }
      };
      synth.onvoiceschanged = selectFemaleVoice;
      selectFemaleVoice();
    }
  }, []);

  // Helper function to speak text.
  const speak = (text: string) => {
    return new Promise<void>((resolve) => {
      if (!window.speechSynthesis) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  // Setup speech recognition.
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => {
      setStatus("Listening...");
      setOutput("Listening...");
    };
    recognition.onresult = async (event: any) => {
      const command = event.results[0][0].transcript;
      setOutput(`You said: ${command}`);
      const response = await getGeminiResponse(command);
      setOutput(`Assistant: ${response}`);
      await speak(response);
      setStatus("Click the microphone to ask again.");
      setIsListening(false);
    };
    recognition.onerror = (event: any) => {
      setOutput("Speech recognition failed. Please say your query again.");
      setTextInputVisible(true);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognitionRef.current = recognition;
  }, [selectedVoice]);

  // Start listening for voice input.
  const startListening = () => {
    if (isListening) return;
    setIsListening(true);
    setStatus("Speak now!");
    speak("Please ask your air quality query.").then(() => {
      recognitionRef.current && recognitionRef.current.start();
    });
  };

  // Handle text query submission.
  const handleTextSubmit = async () => {
    if (textInput.trim() === "") return;
    const command = textInput;
    setOutput(`You said: ${command}`);
    const response = await getGeminiResponse(command);
    setOutput(`Assistant: ${response}`);
    await speak(response);
    setStatus("Click the microphone to ask again.");
  };

  return (
    <div className="mt-8 p-4 border rounded shadow bg-white dark:bg-stone-900 text-center">
      <h2 className="text-xl font-semibold mb-2">AQI Voice Assistant</h2>
      <p className="mb-4">Speak your query about air quality</p>
      {/* The microphone button changes shape based on isListening */}
      <button
        onClick={startListening}
        className={`flex items-center justify-center mx-auto p-3 text-white ${
          isListening
            ? "bg-green-700 rounded-lg" // When listening: dark green, rounded square.
            : "bg-green-500 rounded-full hover:bg-green-600" // Default: light green circle.
        }`}
      >
        <Mic className="h-6 w-6" />
      </button>
      <div className="mt-4 p-2 bg-gray-100 dark:bg-black rounded" id="output">
        {output}
      </div>
      <div
        className="mt-2 text-sm text-gray-600 dark:text-gray-300"
        id="status"
      >
        {status}
      </div>
      {textInputVisible && (
        <div className="mt-4 flex justify-center items-center gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your query here..."
            className="px-2 py-1 border rounded w-80"
          />
          <button
            onClick={handleTextSubmit}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

// ----- AQIDashboard Component -----
export function AQIDashboard() {
  const {
    location,
    loading: locationLoading,
    error: locationError,
  } = useLocation();
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (location) {
        try {
          setLoading(true);
          const data = await AQIService.getNearestStation(
            location.latitude,
            location.longitude
          );
          setAqiData(data);
          setError(null);
        } catch (err: any) {
          console.error("Error fetching AQI data:", err);
          setError("Failed to fetch air quality data");
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [location]);

  if (locationLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }
  if (locationError || error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-destructive">
          {locationError || error || "Something went wrong"}
        </div>
      </div>
    );
  }
  if (!aqiData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">No data available</div>
      </div>
    );
  }

  const sampleHistoricalData = [
    { timestamp: "2025-03-15T05:30:00", aqi: 145 },
    { timestamp: "2025-03-15T07:00:00", aqi: 154 },
    { timestamp: "2025-03-15T09:30:00", aqi: 148 },
  ];

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <Card className="p-4 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-2">Air Quality Status</h3>
            <div
              className="text-3xl font-bold mb-1"
              style={{ color: getAQIStatus(aqiData.aqi).color }}
            >
              {getAQIStatus(aqiData.aqi).text}
            </div>
            <p className="text-sm text-muted-foreground">
              {getAQIStatus(aqiData.aqi).description}
            </p>
          </div>
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundColor: getAQIStatus(aqiData.aqi).color }}
          />
        </Card>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Temperature</h3>
              <div className="text-3xl font-bold">24°C</div>
            </div>
            <Thermometer className="h-6 w-6 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Humidity</h3>
              <div className="text-3xl font-bold">65%</div>
            </div>
            <Droplets className="h-6 w-6 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Wind Speed</h3>
              <div className="text-3xl font-bold">12 km/h</div>
            </div>
            <Wind className="h-6 w-6 text-primary" />
          </div>
        </Card>
      </motion.div>

      {/* Main Data Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold mb-4">Current AQI</h2>
              <div className="text-4xl font-bold mb-2">{aqiData.aqi}</div>
              <div className="text-muted-foreground">Mumbai, India</div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Major Pollutants</h2>
              <div className="space-y-2">
                <div>PM2.5: {aqiData.pollutants.pm25.toFixed(2)}</div>
                <div>PM10: {aqiData.pollutants.pm10.toFixed(2)}</div>
                <div>O3: {aqiData.pollutants.o3.toFixed(2)}</div>
                <div>NO2: {aqiData.pollutants.no2.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Health Recommendations</h2>
          <HealthAdvice aqi={aqiData.aqi} />
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Activity Suggestions</h2>
          <ActivitySuggestions aqi={aqiData.aqi} />
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Pollutant Breakdown</h2>
          <PollutantBreakdown
            pollutants={{
              pm25: parseFloat(aqiData.pollutants.pm25.toFixed(2)),
              pm10: parseFloat(aqiData.pollutants.pm10.toFixed(2)),
              o3: parseFloat(aqiData.pollutants.o3.toFixed(2)),
              no2: parseFloat(aqiData.pollutants.no2.toFixed(2)),
              so2: parseFloat((aqiData.pollutants.so2 ?? 0).toFixed(2)),
              co: parseFloat((aqiData.pollutants.co ?? 0).toFixed(2)),
            }}
          />
        </Card>
      </div>

      {/* Historical Trend */}
      <HistoricalTrend data={sampleHistoricalData} />

      {/* --- Speech Assistant Section at the Bottom --- */}
      <SpeechAssistant />
    </div>
  );
}

export default AQIDashboard;
