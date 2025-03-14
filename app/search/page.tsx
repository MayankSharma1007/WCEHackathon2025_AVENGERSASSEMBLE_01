// // "use client"

// // import { useState } from "react"
// // import { motion } from "framer-motion"
// // import { Input } from "@/components/ui/input"
// // import { Button } from "@/components/ui/button"
// // import { Card } from "@/components/ui/card"
// // import { Search as SearchIcon, MapPin, Globe } from "lucide-react"
// // import { AQIService, AQIData } from "@/lib/api/aqi-service"
// // import { useToast } from "@/components/ui/use-toast"

// // // Add color utility function
// // function getAQIColor(aqi: number): string {
// //   if (aqi <= 50) return 'text-green-500';
// //   if (aqi <= 100) return 'text-yellow-500';
// //   if (aqi <= 150) return 'text-orange-500';
// //   if (aqi <= 200) return 'text-red-500';
// //   if (aqi <= 300) return 'text-purple-500';
// //   return 'text-rose-900';
// // }

// // // Add loading skeleton
// // function SearchSkeleton() {
// //   return (
// //     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
// //       {[...Array(6)].map((_, i) => (
// //         <div key={i} className="animate-pulse">
// //           <div className="h-[200px] bg-muted rounded-lg"></div>
// //         </div>
// //       ))}
// //     </div>
// //   )
// // }

// // const recommendedPlaces = [
// //   {
// //     name: "New York City",
// //     country: "USA",
// //     coordinates: { lat: 40.7128, lng: -74.0060 }
// //   },
// //   {
// //     name: "Tokyo",
// //     country: "Japan",
// //     coordinates: { lat: 35.6762, lng: 139.6503 }
// //   },
// //   {
// //     name: "London",
// //     country: "UK",
// //     coordinates: { lat: 51.5074, lng: -0.1278 }
// //   },
// //   {
// //     name: "Delhi",
// //     country: "India",
// //     coordinates: { lat: 28.6139, lng: 77.2090 }
// //   },
// //   {
// //     name: "Beijing",
// //     country: "China",
// //     coordinates: { lat: 39.9042, lng: 116.4074 }
// //   },
// //   {
// //     name: "Paris",
// //     country: "France",
// //     coordinates: { lat: 48.8566, lng: 2.3522 }
// //   },
// //   {
// //     name: "Mumbai",
// //     country: "India",
// //     coordinates: { lat: 19.0760, lng: 72.8777 }
// //   },
// //   {
// //     name: "Los Angeles",
// //     country: "USA",
// //     coordinates: { lat: 34.0522, lng: -118.2437 }
// //   }
// // ]

// // export default function SearchPage() {
// //   const [searchTerm, setSearchTerm] = useState("")
// //   const [results, setResults] = useState<AQIData[]>([])
// //   const [loading, setLoading] = useState(false)
// //   const { toast } = useToast()

// //   const handleSearch = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     if (!searchTerm.trim()) return

// //     setLoading(true)
// //     try {
// //       const data = await AQIService.searchStations(searchTerm)
// //       setResults(data)
// //     } catch (error) {
// //       toast({
// //         title: "Error",
// //         description: "Failed to search locations. Please try again.",
// //         variant: "destructive",
// //       })
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const handlePlaceClick = async (place: typeof recommendedPlaces[0]) => {
// //     try {
// //       setLoading(true)
// //       const data = await AQIService.getNearestStation(
// //         place.coordinates.lat,
// //         place.coordinates.lng
// //       )
// //       setResults([data])
// //     } catch (error) {
// //       toast({
// //         title: "Error",
// //         description: "Failed to fetch air quality data for this location",
// //         variant: "destructive"
// //       })
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   return (
// //     <div className="container mx-auto p-4 space-y-6">
// //       <motion.div
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.5 }}
// //       >
// //         <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
// //           <span className="text-muted-foreground">Search</span>
// //           <span className="text-primary">Locations</span>
// //         </h1>

// //         <form onSubmit={handleSearch} className="flex gap-2">
// //           <Input
// //             placeholder="Search cities or locations..."
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             className="flex-1"
// //           />
// //           <Button type="submit" disabled={loading}>
// //             {loading ? (
// //               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
// //             ) : (
// //               <SearchIcon className="h-5 w-5" />
// //             )}
// //           </Button>
// //         </form>
// //       </motion.div>

// //       {/* Recommended Places */}
// //       <div className="space-y-3">
// //         <h2 className="text-lg font-semibold flex items-center gap-2">
// //           <Globe className="h-5 w-5" />
// //           Recommended Places
// //         </h2>
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //           {recommendedPlaces.map((place) => (
// //             <Card
// //               key={place.name}
// //               className="cursor-pointer hover:shadow-md transition-shadow"
// //               onClick={() => handlePlaceClick(place)}
// //             >
// //               <div className="p-4">
// //                 <h3 className="font-medium">{place.name}</h3>
// //                 <p className="text-sm text-muted-foreground">{place.country}</p>
// //               </div>
// //             </Card>
// //           ))}
// //         </div>
// //       </div>

// //       {loading ? (
// //         <SearchSkeleton />
// //       ) : (
// //         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
// //           {results.map((result, index) => (
// //             <motion.div
// //               key={index}
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.5, delay: index * 0.1 }}
// //             >
// //               <Card className="p-4 hover:shadow-lg transition-shadow">
// //                 <div className="flex items-start justify-between">
// //                   <div>
// //                     <h3 className="font-semibold">{result.station}</h3>
// //                     <p className="text-sm text-muted-foreground flex items-center gap-1">
// //                       <MapPin className="h-4 w-4" />
// //                       {result.city}
// //                     </p>
// //                   </div>
// //                   <div className="text-right">
// //                     <div className={`text-2xl font-bold ${getAQIColor(result.aqi)}`}>
// //                       {result.aqi}
// //                     </div>
// //                     <div className="text-sm text-muted-foreground">AQI</div>
// //                   </div>
// //                 </div>
// //                 <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
// //                   <div>
// //                     <span className="text-muted-foreground">PM2.5: </span>
// //                     {result.pollutants.pm25 > 0 ? (
// //                       <span className={getAQIColor(result.pollutants.pm25)}>
// //                         {result.pollutants.pm25.toFixed(1)}
// //                       </span>
// //                     ) : (
// //                       <span className="text-muted-foreground">N/A</span>
// //                     )}
// //                   </div>
// //                   <div>
// //                     <span className="text-muted-foreground">PM10: </span>
// //                     {result.pollutants.pm10 > 0 ? (
// //                       <span className={getAQIColor(result.pollutants.pm10)}>
// //                         {result.pollutants.pm10.toFixed(1)}
// //                       </span>
// //                     ) : (
// //                       <span className="text-muted-foreground">N/A</span>
// //                     )}
// //                   </div>
// //                   <div>
// //                     <span className="text-muted-foreground">O₃: </span>
// //                     {result.pollutants.o3 > 0 ? (
// //                       <span className={getAQIColor(result.pollutants.o3)}>
// //                         {result.pollutants.o3.toFixed(1)}
// //                       </span>
// //                     ) : (
// //                       <span className="text-muted-foreground">N/A</span>
// //                     )}
// //                   </div>
// //                   <div>
// //                     <span className="text-muted-foreground">NO₂: </span>
// //                     {result.pollutants.no2 > 0 ? (
// //                       <span className={getAQIColor(result.pollutants.no2)}>
// //                         {result.pollutants.no2.toFixed(1)}
// //                       </span>
// //                     ) : (
// //                       <span className="text-muted-foreground">N/A</span>
// //                     )}
// //                   </div>
// //                 </div>
// //               </Card>
// //             </motion.div>
// //           ))}
// //         </div>
// //       )}

// //       {results.length === 0 && !loading && searchTerm && (
// //         <motion.div
// //           initial={{ opacity: 0 }}
// //           animate={{ opacity: 1 }}
// //           className="text-center py-8 text-muted-foreground"
// //         >
// //           No results found
// //         </motion.div>
// //       )}
// //     </div>
// //   )
// // }

// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Search as SearchIcon, MapPin, Globe } from "lucide-react"
// import { AQIService } from "@/lib/api/aqi-service"
// import { useToast } from "@/components/ui/use-toast"

// // Update AQIData interface to include SO2 and CO
// interface AQIData {
//   station: string;
//   city: string;
//   aqi: number;
//   pollutants: {
//     pm25: number;
//     pm10: number;
//     o3: number;
//     no2: number;
//     so2: number; // Added SO2
//     co: number;   // Added CO
//   };
// }

// // Add color utility function for AQI
// function getAQIColor(aqi: number): string {
//   if (!Number.isFinite(aqi) || aqi < 0) return 'text-gray-500';
//   if (aqi <= 50) return 'text-green-500';      // Good
//   if (aqi <= 100) return 'text-yellow-500';    // Moderate
//   if (aqi <= 150) return 'text-orange-500';    // Unhealthy for Sensitive Groups
//   if (aqi <= 200) return 'text-red-500';       // Unhealthy
//   if (aqi <= 300) return 'text-purple-500';    // Very Unhealthy
//   if (aqi <= 500) return 'text-red-900';       // Hazardous
//   return 'text-gray-500';
// }

// // Add AQI category function
// function getAQICategory(aqi: number): string {
//   if (!Number.isFinite(aqi) || aqi < 0) return 'Invalid';
//   if (aqi <= 50) return 'Good';
//   if (aqi <= 100) return 'Moderate';
//   if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
//   if (aqi <= 200) return 'Unhealthy';
//   if (aqi <= 300) return 'Very Unhealthy';
//   if (aqi <= 500) return 'Hazardous';
//   return 'Invalid';
// }

// // Function to convert pollutant concentration to AQI sub-index using EPA breakpoints
// function calculatePollutantAQI(pollutant: string, concentration: number): number {
//   // EPA breakpoints: [C_low, C_high, AQI_low, AQI_high]
//   const breakpoints: { [key: string]: number[][] } = {
//     pm25: [ // 24-hour average in µg/m³
//       [0.0, 12.0, 0, 50],      // Good
//       [12.1, 35.4, 51, 100],   // Moderate
//       [35.5, 55.4, 101, 150],  // Unhealthy for Sensitive Groups
//       [55.5, 150.4, 151, 200], // Unhealthy
//       [150.5, 250.4, 201, 300], // Very Unhealthy
//       [250.5, 500.4, 301, 500], // Hazardous
//     ],
//     pm10: [ // 24-hour average in µg/m³
//       [0, 54, 0, 50],
//       [55, 154, 51, 100],
//       [155, 254, 101, 150],
//       [255, 354, 151, 200],
//       [355, 424, 201, 300],
//       [425, 604, 301, 500],
//     ],
//     o3: [ // 8-hour average in ppm
//       [0.000, 0.054, 0, 50],
//       [0.055, 0.070, 51, 100],
//       [0.071, 0.085, 101, 150],
//       [0.086, 0.105, 151, 200],
//       [0.106, 0.200, 201, 300],
//       [0.201, 0.400, 301, 500],
//     ],
//     no2: [ // 1-hour average in ppb
//       [0, 53, 0, 50],
//       [54, 100, 51, 100],
//       [101, 360, 101, 150],
//       [361, 649, 151, 200],
//       [650, 1249, 201, 300],
//       [1250, 2049, 301, 500],
//     ],
//     so2: [ // 1-hour average in ppb
//       [0, 35, 0, 50],
//       [36, 75, 51, 100],
//       [76, 185, 101, 150],
//       [186, 304, 151, 200],
//       [305, 604, 201, 300],
//       [605, 1004, 301, 500],
//     ],
//     co: [ // 8-hour average in ppm
//       [0.0, 4.4, 0, 50],
//       [4.5, 9.4, 51, 100],
//       [9.5, 12.4, 101, 150],
//       [12.5, 15.4, 151, 200],
//       [15.5, 30.4, 201, 300],
//       [30.5, 50.4, 301, 500],
//     ],
//   };

//   if (!breakpoints[pollutant] || concentration < 0) return 0;

//   let aqi = 0;
//   for (const [cLow, cHigh, aqiLow, aqiHigh] of breakpoints[pollutant]) {
//     if (concentration >= cLow && concentration <= cHigh) {
//       // Linear interpolation: AQI = [(AQI_high - AQI_low) / (C_high - C_low)] * (C - C_low) + AQI_low
//       aqi = ((aqiHigh - aqiLow) / (cHigh - cLow)) * (concentration - cLow) + aqiLow;
//       break;
//     }
//   }

//   // Cap AQI at 500 if concentration exceeds the highest range
//   if (concentration > breakpoints[pollutant][breakpoints[pollutant].length - 1][1]) {
//     aqi = 500;
//   }

//   return Math.round(aqi);
// }

// // Add loading skeleton
// function SearchSkeleton() {
//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//       {[...Array(6)].map((_, i) => (
//         <div key={i} className="animate-pulse">
//           <div className="h-[200px] bg-muted rounded-lg"></div>
//         </div>
//       ))}
//     </div>
//   )
// }

// const recommendedPlaces = [
//   {
//     name: "Ghatkopar",
//     country: "Mumbai",
//     coordinates: { lat: 19.0785, lng: 72.9052 }
//   },
//   {
//     name: "BKC",
//     country: "Mumbai",
//     coordinates: { lat: 19.0675, lng: 72.8676 }
//   },
//   {
//     name: "Jawaharlal Nehru Stadium",
//     country: "Delhi",
//     coordinates: { lat: 28.5733, lng: 77.2410 }
//   },
//   {
//     name: "Bapuji Nagar",
//     country: "Bengaluru",
//     coordinates: { lat: 12.9661, lng: 77.5946 }
//   },
//   {
//     name: "Central University",
//     country: "Hyderabad",
//     coordinates: { lat: 17.4446, lng: 78.3498 }
//   },
//   {
//     name: "Vasai West",
//     country: "Mumbai",
//     coordinates: { lat: 19.3957, lng: 72.8319 }
//   },
//   {
//     name: "Chhatrapati Shivaji International Airport",
//     country: "Mumbai",
//     coordinates: { lat: 19.0897, lng: 72.8678 }
//   },
//   {
//     name: "Fort William",
//     country: "Kolkata",
//     coordinates: { lat: 22.5612, lng: 88.3397 } // Corrected coordinates for Kolkata
//   }
// ]

// export default function SearchPage() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [results, setResults] = useState<AQIData[]>([])
//   const [loading, setLoading] = useState(false)
//   const { toast } = useToast()

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!searchTerm.trim()) return

//     setLoading(true)
//     try {
//       const data = await AQIService.searchStations(searchTerm)
//       setResults(data.map(item => ({
//         ...item,
//         city: item.city || "Unknown City",
//         station: item.station || "Unknown Station",
//         pollutants: {
//           ...item.pollutants,
//           so2: item.pollutants.so2 ?? 0,
//           co: item.pollutants.co ?? 0
//         }
//       })))
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to search locations. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePlaceClick = async (place: typeof recommendedPlaces[0]) => {
//     try {
//       setLoading(true)
//       const data = await AQIService.getNearestStation(
//         place.coordinates.lat,
//         place.coordinates.lng
//       )
//       // Use place.name as station and place.country as city
//       const updatedData = {
//         ...data,
//         station: place.name || "Unknown Station",
//         city: place.country || data.city || "Unknown City",
//         pollutants: {
//           ...data.pollutants,
//           so2: data.pollutants.so2 ?? 0, // Default to 0 if undefined
//           co: data.pollutants.co ?? 0,   // Default to 0 if undefined
//         },
//       }
//       setResults([updatedData])
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch air quality data for this location",
//         variant: "destructive"
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="container mx-auto p-4 space-y-6">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
//           <span className="text-muted-foreground">Search</span>
//           <span className="text-primary">Locations</span>
//         </h1>

//         <form onSubmit={handleSearch} className="flex gap-2">
//           <Input
//             placeholder="Search cities or locations..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="flex-1"
//           />
//           <Button type="submit" disabled={loading}>
//             {loading ? (
//               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
//             ) : (
//               <SearchIcon className="h-5 w-5" />
//             )}
//           </Button>
//         </form>
//       </motion.div>

//       {/* Recommended Places */}
//       <div className="space-y-3">
//         <h2 className="text-lg font-semibold flex items-center gap-2">
//           <Globe className="h-5 w-5" />
//           Recommended Places
//         </h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {recommendedPlaces.map((place) => (
//             <Card
//               key={place.name}
//               className="cursor-pointer hover:shadow-md transition-shadow"
//               onClick={() => handlePlaceClick(place)}
//             >
//               <div className="p-4">
//                 <h3 className="font-medium">{place.name}</h3>
//                 <p className="text-sm text-muted-foreground">{place.country}</p>
//               </div>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {loading ? (
//         <SearchSkeleton />
//       ) : (
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {results.map((result, index) => {
//             const aqiCategory = getAQICategory(result.aqi);
//             return (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//               >
//                 <Card className="p-4 hover:shadow-lg transition-shadow">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <h3 className="font-semibold">{result.station}</h3>
//                       <p className="text-sm text-muted-foreground flex items-center gap-1">
//                         <MapPin className="h-4 w-4" />
//                         {result.city}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <div className={text-2xl font-bold ${getAQIColor(result.aqi)}}>
//                         {result.aqi}
//                       </div>
//                       <div className="text-sm text-muted-foreground">AQI</div>
//                     </div>
//                   </div>
//                   <div className="mt-4">
//                     <p className="text-sm font-medium">Pollutants:</p>
//                     <div className="grid grid-cols-2 gap-2 text-sm mt-2">
//                       <div>
//                         <span className="text-muted-foreground">PM2.5: </span>
//                         {result.pollutants.pm25 > 0 ? (
//                           <span className={getAQIColor(calculatePollutantAQI('pm25', result.pollutants.pm25))}>
//                             {result.pollutants.pm25.toFixed(1)}
//                           </span>
//                         ) : (
//                           <span className="text-muted-foreground">N/A</span>
//                         )}
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">PM10: </span>
//                         {result.pollutants.pm10 > 0 ? (
//                           <span className={getAQIColor(calculatePollutantAQI('pm10', result.pollutants.pm10))}>
//                             {result.pollutants.pm10.toFixed(1)}
//                           </span>
//                         ) : (
//                           <span className="text-muted-foreground">N/A</span>
//                         )}
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">O₃: </span>
//                         {result.pollutants.o3 > 0 ? (
//                           <span className={getAQIColor(calculatePollutantAQI('o3', result.pollutants.o3))}>
//                             {result.pollutants.o3.toFixed(1)}
//                           </span>
//                         ) : (
//                           <span className="text-muted-foreground">N/A</span>
//                         )}
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">NO₂: </span>
//                         {result.pollutants.no2 > 0 ? (
//                           <span className={getAQIColor(calculatePollutantAQI('no2', result.pollutants.no2))}>
//                             {result.pollutants.no2.toFixed(1)}
//                           </span>
//                         ) : (
//                           <span className="text-muted-foreground">N/A</span>
//                         )}
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">SO₂: </span>
//                         {result.pollutants.so2 > 0 ? (
//                           <span className={getAQIColor(calculatePollutantAQI('so2', result.pollutants.so2))}>
//                             {result.pollutants.so2.toFixed(1)}
//                           </span>
//                         ) : (
//                           <span className="text-muted-foreground">N/A</span>
//                         )}
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">CO: </span>
//                         {result.pollutants.co > 0 ? (
//                           <span className={getAQIColor(calculatePollutantAQI('co', result.pollutants.co))}>
//                             {result.pollutants.co.toFixed(1)}
//                           </span>
//                         ) : (
//                           <span className="text-muted-foreground">N/A</span>
//                         )}
//                       </div>
//                     </div>
//                     <p className={mt-2 text-lg font-bold ${getAQIColor(result.aqi)}}>
//                       Air Quality: {aqiCategory}
//                     </p>
//                   </div>
//                 </Card>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}

//       {results.length === 0 && !loading && searchTerm && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-center py-8 text-muted-foreground"
//         >
//           No results found
//         </motion.div>
//       )}
//     </div>
//   )
// }

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search as SearchIcon, MapPin, Globe } from "lucide-react";
import { AQIService } from "@/lib/api/aqi-service";
import { useToast } from "@/components/ui/use-toast";

// Updated AQIData interface to include SO2 and CO
interface AQIData {
  station: string;
  city: string;
  aqi: number;
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    so2: number; // Added SO2
    co: number; // Added CO
  };
}

// Utility function for AQI color classes
function getAQIColor(aqi: number): string {
  if (!Number.isFinite(aqi) || aqi < 0) return "text-gray-500";
  if (aqi <= 50) return "text-green-500"; // Good
  if (aqi <= 100) return "text-yellow-500"; // Moderate
  if (aqi <= 150) return "text-orange-500"; // Unhealthy for Sensitive Groups
  if (aqi <= 200) return "text-red-500"; // Unhealthy
  if (aqi <= 300) return "text-purple-500"; // Very Unhealthy
  if (aqi <= 500) return "text-red-900"; // Hazardous
  return "text-gray-500";
}

// Utility function for AQI category
function getAQICategory(aqi: number): string {
  if (!Number.isFinite(aqi) || aqi < 0) return "Invalid";
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  if (aqi <= 500) return "Hazardous";
  return "Invalid";
}

// Function to convert pollutant concentration to AQI sub-index using EPA breakpoints
function calculatePollutantAQI(
  pollutant: string,
  concentration: number
): number {
  // EPA breakpoints: [C_low, C_high, AQI_low, AQI_high]
  const breakpoints: { [key: string]: number[][] } = {
    pm25: [
      // 24-hour average in µg/m³
      [0.0, 12.0, 0, 50],
      [12.1, 35.4, 51, 100],
      [35.5, 55.4, 101, 150],
      [55.5, 150.4, 151, 200],
      [150.5, 250.4, 201, 300],
      [250.5, 500.4, 301, 500],
    ],
    pm10: [
      // 24-hour average in µg/m³
      [0, 54, 0, 50],
      [55, 154, 51, 100],
      [155, 254, 101, 150],
      [255, 354, 151, 200],
      [355, 424, 201, 300],
      [425, 604, 301, 500],
    ],
    o3: [
      // 8-hour average in ppm
      [0.0, 0.054, 0, 50],
      [0.055, 0.07, 51, 100],
      [0.071, 0.085, 101, 150],
      [0.086, 0.105, 151, 200],
      [0.106, 0.2, 201, 300],
      [0.201, 0.4, 301, 500],
    ],
    no2: [
      // 1-hour average in ppb
      [0, 53, 0, 50],
      [54, 100, 51, 100],
      [101, 360, 101, 150],
      [361, 649, 151, 200],
      [650, 1249, 201, 300],
      [1250, 2049, 301, 500],
    ],
    so2: [
      // 1-hour average in ppb
      [0, 35, 0, 50],
      [36, 75, 51, 100],
      [76, 185, 101, 150],
      [186, 304, 151, 200],
      [305, 604, 201, 300],
      [605, 1004, 301, 500],
    ],
    co: [
      // 8-hour average in ppm
      [0.0, 4.4, 0, 50],
      [4.5, 9.4, 51, 100],
      [9.5, 12.4, 101, 150],
      [12.5, 15.4, 151, 200],
      [15.5, 30.4, 201, 300],
      [30.5, 50.4, 301, 500],
    ],
  };

  if (!breakpoints[pollutant] || concentration < 0) return 0;

  let aqi = 0;
  for (const [cLow, cHigh, aqiLow, aqiHigh] of breakpoints[pollutant]) {
    if (concentration >= cLow && concentration <= cHigh) {
      // Linear interpolation formula
      aqi =
        ((aqiHigh - aqiLow) / (cHigh - cLow)) * (concentration - cLow) + aqiLow;
      break;
    }
  }

  // Cap AQI at 500 if concentration exceeds highest range
  if (
    concentration > breakpoints[pollutant][breakpoints[pollutant].length - 1][1]
  ) {
    aqi = 500;
  }

  return Math.round(aqi);
}

// Loading skeleton component
function SearchSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-[200px] bg-muted rounded-lg"></div>
        </div>
      ))}
    </div>
  );
}

const recommendedPlaces = [
  {
    name: "Ghatkopar",
    country: "Mumbai",
    coordinates: { lat: 19.0785, lng: 72.9052 },
  },
  {
    name: "BKC",
    country: "Mumbai",
    coordinates: { lat: 19.0675, lng: 72.8676 },
  },
  {
    name: "Jawaharlal Nehru Stadium",
    country: "Delhi",
    coordinates: { lat: 28.5733, lng: 77.241 },
  },
  {
    name: "Bapuji Nagar",
    country: "Bengaluru",
    coordinates: { lat: 12.9661, lng: 77.5946 },
  },
  {
    name: "Central University",
    country: "Hyderabad",
    coordinates: { lat: 17.4446, lng: 78.3498 },
  },
  {
    name: "Vasai West",
    country: "Mumbai",
    coordinates: { lat: 19.3957, lng: 72.8319 },
  },
  {
    name: "Chhatrapati Shivaji International Airport",
    country: "Mumbai",
    coordinates: { lat: 19.0897, lng: 72.8678 },
  },
  {
    name: "Fort William",
    country: "Kolkata",
    coordinates: { lat: 22.5612, lng: 88.3397 }, // Corrected coordinates for Kolkata
  },
];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<AQIData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const data = await AQIService.searchStations(searchTerm);
      setResults(
        data.map((item) => ({
          ...item,
          city: item.city || "Unknown City",
          station: item.station || "Unknown Station",
          pollutants: {
            ...item.pollutants,
            so2: item.pollutants.so2 ?? 0,
            co: item.pollutants.co ?? 0,
          },
        }))
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search locations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceClick = async (place: (typeof recommendedPlaces)[0]) => {
    try {
      setLoading(true);
      const data = await AQIService.getNearestStation(
        place.coordinates.lat,
        place.coordinates.lng
      );
      // Use place details for station and city
      const updatedData = {
        ...data,
        station: place.name || "Unknown Station",
        city: place.country || data.city || "Unknown City",
        pollutants: {
          ...data.pollutants,
          so2: data.pollutants.so2 ?? 0,
          co: data.pollutants.co ?? 0,
        },
      };
      setResults([updatedData]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch air quality data for this location",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-muted-foreground">Search</span>
          <span className="text-primary">Locations</span>
        </h1>

        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search cities or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <SearchIcon className="h-5 w-5" />
            )}
          </Button>
        </form>
      </motion.div>

      {/* Recommended Places */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Recommended Places
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendedPlaces.map((place) => (
            <Card
              key={place.name}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handlePlaceClick(place)}
            >
              <div className="p-4">
                <h3 className="font-medium">{place.name}</h3>
                <p className="text-sm text-muted-foreground">{place.country}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {loading ? (
        <SearchSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((result, index) => {
            const aqiCategory = getAQICategory(result.aqi);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{result.station}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {result.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold ${getAQIColor(
                          result.aqi
                        )}`}
                      >
                        {result.aqi}
                      </div>
                      <div className="text-sm text-muted-foreground">AQI</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium">Pollutants:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                      <div>
                        <span className="text-muted-foreground">PM2.5: </span>
                        {result.pollutants.pm25 > 0 ? (
                          <span
                            className={getAQIColor(
                              calculatePollutantAQI(
                                "pm25",
                                result.pollutants.pm25
                              )
                            )}
                          >
                            {result.pollutants.pm25.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                      <div>
                        <span className="text-muted-foreground">PM10: </span>
                        {result.pollutants.pm10 > 0 ? (
                          <span
                            className={getAQIColor(
                              calculatePollutantAQI(
                                "pm10",
                                result.pollutants.pm10
                              )
                            )}
                          >
                            {result.pollutants.pm10.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                      <div>
                        <span className="text-muted-foreground">O₃: </span>
                        {result.pollutants.o3 > 0 ? (
                          <span
                            className={getAQIColor(
                              calculatePollutantAQI("o3", result.pollutants.o3)
                            )}
                          >
                            {result.pollutants.o3.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                      <div>
                        <span className="text-muted-foreground">NO₂: </span>
                        {result.pollutants.no2 > 0 ? (
                          <span
                            className={getAQIColor(
                              calculatePollutantAQI(
                                "no2",
                                result.pollutants.no2
                              )
                            )}
                          >
                            {result.pollutants.no2.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                      <div>
                        <span className="text-muted-foreground">SO₂: </span>
                        {result.pollutants.so2 > 0 ? (
                          <span
                            className={getAQIColor(
                              calculatePollutantAQI(
                                "so2",
                                result.pollutants.so2
                              )
                            )}
                          >
                            {result.pollutants.so2.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                      <div>
                        <span className="text-muted-foreground">CO: </span>
                        {result.pollutants.co > 0 ? (
                          <span
                            className={getAQIColor(
                              calculatePollutantAQI("co", result.pollutants.co)
                            )}
                          >
                            {result.pollutants.co.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                    </div>
                    <p
                      className={`mt-2 text-lg font-bold ${getAQIColor(
                        result.aqi
                      )}`}
                    >
                      Air Quality: {aqiCategory}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {results.length === 0 && !loading && searchTerm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-muted-foreground"
        >
          No results found
        </motion.div>
      )}
    </div>
  );
}
