// const WAQI_API_KEY = process.env.NEXT_PUBLIC_WAQI_TOKEN;
// const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
// const WAQI_BASE_URL = 'https://api.waqi.info';
// const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// interface LocationDetails {
//   city: string;
//   state?: string;
//   country: string;
//   formatted_address?: string;
// }

// export interface AQIData {
//   aqi: number;
//   station: string;
//   city?: string;
//   time: string;
//   pollutants: {
//     pm25: number;
//     pm10: number;
//     o3: number;
//     no2: number;
//     so2?: number;
//     co?: number;
//   };
//   location?: {
//     latitude: number;
//     longitude: number;
//   };
//   locationDetails?: LocationDetails;
// }

// // Add caching for API responses
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// interface CacheItem<T> {
//   data: T;
//   timestamp: number;
// }

// export class AQIService {
//   private static cache: Map<string, CacheItem<any>> = new Map();

//   private static async fetchWithCache<T>(
//     key: string,
//     fetchFn: () => Promise<T>
//   ): Promise<T> {
//     const cached = this.cache.get(key);
//     const now = Date.now();

//     if (cached && now - cached.timestamp < CACHE_DURATION) {
//       return cached.data;
//     }

//     try {
//       const data = await fetchFn();
//       this.cache.set(key, { data, timestamp: now });
//       return data;
//     } catch (error) {
//       console.error('Cache fetch error:', error);
//       throw error;
//     }
//   }

//   static async getNearestStation(lat: number, lon: number): Promise<AQIData> {
//     const cacheKey = `station:${lat},${lon}`;

//     return this.fetchWithCache(cacheKey, async () => {
//       try {
//         const url = `${WAQI_BASE_URL}/feed/geo:${lat};${lon}/?token=${WAQI_API_KEY}`;
//         console.log('Fetching AQI data from:', url);

//         const response = await fetch(url);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         if (data.status !== 'ok' || !data.data) {
//           throw new Error(data.data || 'Invalid response from AQI API');
//         }

//         return this.transformStationData(data.data);
//       } catch (error) {
//         console.error('Error fetching AQI data:', error);
//         throw new Error('Failed to fetch AQI data');
//       }
//     });
//   }

//   static async searchStations(query: string): Promise<AQIData[]> {
//     const cacheKey = `search:${query}`;

//     return this.fetchWithCache(cacheKey, async () => {
//       try {
//         const url = `${WAQI_BASE_URL}/search/?token=${WAQI_API_KEY}&keyword=${encodeURIComponent(query)}`;
//         console.log('Searching stations at:', url);

//         const response = await fetch(url);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         if (data.status !== 'ok' || !data.data) {
//           throw new Error(data.data || 'Invalid response from search API');
//         }

//         return data.data.map(this.transformStationData);
//       } catch (error) {
//         console.error('Error searching stations:', error);
//         throw new Error('Failed to search stations');
//       }
//     });
//   }

//   private static transformStationData(data: any): AQIData {
//     if (!data || typeof data.aqi === 'undefined') {
//       throw new Error('Invalid station data');
//     }

//     return {
//       aqi: data.aqi,
//       station: data.station?.name || 'Unknown Station',
//       city: data.city?.name,
//       time: data.time?.iso || new Date().toISOString(),
//       pollutants: {
//         pm25: data.iaqi?.pm25?.v || 0,
//         pm10: data.iaqi?.pm10?.v || 0,
//         o3: data.iaqi?.o3?.v || 0,
//         no2: data.iaqi?.no2?.v || 0,
//         so2: data.iaqi?.so2?.v,
//         co: data.iaqi?.co?.v
//       },
//       location: data.city?.geo ? {
//         latitude: data.city.geo[0],
//         longitude: data.city.geo[1]
//       } : undefined
//     };
//   }

//   private static async getOpenWeatherData(lat: number, lng: number): Promise<AQIData | null> {
//     try {
//       const response = await fetch(
//         `${OPENWEATHER_BASE_URL}/air_pollution?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}`
//       );
//       const data = await response.json();

//       if (!data.list || !data.list[0]) {
//         throw new Error('Invalid OpenWeather data');
//       }

//       const components = data.list[0].components;
//       const aqi = data.list[0].main.aqi;

//       return {
//         aqi: this.convertOpenWeatherAQI(aqi),
//         station: `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
//         city: `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
//         time: new Date().toISOString(),
//         pollutants: {
//           pm25: components.pm2_5 || 0,
//           pm10: components.pm10 || 0,
//           o3: components.o3 || 0,
//           no2: components.no2 || 0,
//         },
//         location: {
//           latitude: lat,
//           longitude: lng
//         }
//       };
//     } catch (error) {
//       console.error('OpenWeather API error:', error);
//       return null;
//     }
//   }

//   private static async getWAQIData(lat: number, lng: number): Promise<AQIData> {
//     const response = await fetch(
//       `${WAQI_BASE_URL}/feed/geo:${lat};${lng}/?token=${WAQI_API_KEY}`
//     );
//     const data = await response.json();

//     if (data.status !== 'ok') {
//       throw new Error('Failed to fetch WAQI data');
//     }

//     return {
//       aqi: data.data.aqi,
//       station: data.data.city.name,
//       city: data.data.city.name,
//       time: data.data.time.iso,
//       pollutants: {
//         pm25: data.data.iaqi.pm25?.v || 0,
//         pm10: data.data.iaqi.pm10?.v || 0,
//         o3: data.data.iaqi.o3?.v || 0,
//         no2: data.data.iaqi.no2?.v || 0,
//       },
//       location: data.data.city.geo ? {
//         latitude: data.data.city.geo[0],
//         longitude: data.data.city.geo[1]
//       } : undefined,
//     };
//   }

//   // Convert OpenWeather AQI (1-5) to a more standard 0-500 scale
//   private static convertOpenWeatherAQI(openWeatherAQI: number): number {
//     const aqiRanges: Record<number, number> = {
//       1: 25,  // Good
//       2: 75,  // Fair
//       3: 150, // Moderate
//       4: 200, // Poor
//       5: 300  // Very Poor
//     };
//     return aqiRanges[openWeatherAQI as keyof typeof aqiRanges] || 0;
//   }
// }

// apiServices.ts

// New API constants (hardcoded)
const NEW_API_KEY = "63h3AckbgtY";
const NEW_API_BASE_URL =
  "https://atmos.urbansciences.in/adp/v4/getDeviceDataParam/imei";
const NEW_API_PARAMS = "pm2.5cnc,pm10cnc,co,no2ppb,so2,o3ppb";

// Provided list of sites
interface Site {
  lat: number;
  lon: number;
  id: string;
  name: string;
  city: string;
}

const SITE_LIST: Site[] = [
  {
    lat: 28.7256504,
    lon: 77.2011573,
    id: "site_104",
    name: "Burari Crossing, Delhi - IMD",
    city: "Delhi",
  },
  {
    lat: 28.5627763,
    lon: 77.1180053,
    id: "site_106",
    name: "IGI Airport (T3), Delhi - IMD",
    city: "Delhi",
  },
  {
    lat: 28.6514781,
    lon: 77.1473105,
    id: "site_113",
    name: "Shadipur, Delhi - CPCB",
    city: "Delhi",
  },
  {
    lat: 28.6811736,
    lon: 77.3025234,
    id: "site_114",
    name: "IHBAS, Dilshad Garden, Delhi - CPCB",
    city: "Delhi",
  },
  {
    lat: 28.60909,
    lon: 77.0325413,
    id: "site_115",
    name: "NSIT Dwarka, Delhi - CPCB",
    city: "Delhi",
  },
  {
    lat: 28.628624,
    lon: 77.24106,
    id: "site_117",
    name: "ITO, Delhi - CPCB",
    city: "Delhi",
  },
  {
    lat: 28.7500499,
    lon: 77.1112615,
    id: "site_118",
    name: "DTU, Delhi - CPCB",
    city: "Delhi",
  },
  {
    lat: 28.5504249,
    lon: 77.2159377,
    id: "site_119",
    name: "Sirifort, Delhi - CPCB",
    city: "Delhi",
  },
  {
    lat: 28.636429,
    lon: 77.201067,
    id: "site_122",
    name: "Mandir Marg, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.563262,
    lon: 77.186937,
    id: "site_124",
    name: "R K Puram, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.695381,
    lon: 77.181665,
    id: "site_1420",
    name: "Ashok Vihar, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.498571,
    lon: 77.26484,
    id: "site_1421",
    name: "Dr. Karni Singh Shooting Range, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.73282,
    lon: 77.170633,
    id: "site_1423",
    name: "Jahangirpuri, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.58028,
    lon: 77.233829,
    id: "site_1424",
    name: "Jawaharlal Nehru Stadium, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.611281,
    lon: 77.237738,
    id: "site_1425",
    name: "Major Dhyan Chand National Stadium, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.822836,
    lon: 77.101981,
    id: "site_1426",
    name: "Narela, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.570173,
    lon: 76.933762,
    id: "site_1427",
    name: "Najafgarh, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.530785,
    lon: 77.271255,
    id: "site_1428",
    name: "Okhla Phase-2, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.56789,
    lon: 77.250515,
    id: "site_1429",
    name: "Nehru Nagar, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.732528,
    lon: 77.11992,
    id: "site_1430",
    name: "Rohini, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.623763,
    lon: 77.287209,
    id: "site_1431",
    name: "Patparganj, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.710508,
    lon: 77.249485,
    id: "site_1432",
    name: "Sonia Vihar, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.699793,
    lon: 77.165453,
    id: "site_1434",
    name: "Wazirpur, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.672342,
    lon: 77.31526,
    id: "site_1435",
    name: "Vivek Vihar, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 12.951913,
    lon: 77.539784,
    id: "site_1553",
    name: "Bapuji Nagar, Bengaluru - KSPCB",
    city: "Bengaluru",
  },
  {
    lat: 13.029152,
    lon: 77.585901,
    id: "site_1554",
    name: "Hebbal, Bengaluru - KSPCB",
    city: "Bengaluru",
  },
  {
    lat: 12.938539,
    lon: 77.5901,
    id: "site_1555",
    name: "Hombegowda Nagar, Bengaluru - KSPCB",
    city: "Bengaluru",
  },
  {
    lat: 12.920984,
    lon: 77.584908,
    id: "site_1556",
    name: "Jayanagar 5th Block, Bengaluru - KSPCB",
    city: "Bengaluru",
  },
  {
    lat: 12.917348,
    lon: 77.622813,
    id: "site_1558",
    name: "Silk Board, Bengaluru - KSPCB",
    city: "Bengaluru",
  },
  {
    lat: 28.7762,
    lon: 77.051074,
    id: "site_1560",
    name: "Bawana, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.684678,
    lon: 77.076574,
    id: "site_1561",
    name: "Mundka, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.531346,
    lon: 77.190156,
    id: "site_1562",
    name: "Sri Aurobindo Marg, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 28.639652,
    lon: 77.146275,
    id: "site_1563",
    name: "Pusa, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 12.9135218,
    lon: 77.5950804,
    id: "site_162",
    name: "BTM Layout, Bengaluru - CPCB",
    city: "Bengaluru",
  },
  {
    lat: 13.0270199,
    lon: 77.494094,
    id: "site_163",
    name: "Peenya, Bengaluru - CPCB",
    city: "Bengaluru",
  },
  {
    lat: 12.9756843,
    lon: 77.5660749,
    id: "site_165",
    name: "City Railway Station, Bengaluru - KSPCB",
    city: "Bengaluru",
  },
  {
    lat: 12.990328,
    lon: 77.5431385,
    id: "site_166",
    name: "Sanegurava Halli, Bengaluru - KSPCB",
    city: "Bengaluru",
  },
  {
    lat: 17.540891,
    lon: 78.358528,
    id: "site_199",
    name: "Bollaram Industrial Area, Hyderabad - TSPCB",
    city: "Hyderabad",
  },
  {
    lat: 17.5184,
    lon: 78.278777,
    id: "site_251",
    name: "ICRISAT Patancheru, Hyderabad - TSPCB",
    city: "Hyderabad",
  },
  {
    lat: 17.460103,
    lon: 78.334361,
    id: "site_262",
    name: "Central University, Hyderabad - TSPCB",
    city: "Hyderabad",
  },
  {
    lat: 17.5316895,
    lon: 78.218939,
    id: "site_275",
    name: "IDA Pashamylaram, Hyderabad - TSPCB",
    city: "Hyderabad",
  },
  {
    lat: 17.4559458,
    lon: 78.4332152,
    id: "site_294",
    name: "Sanathnagar, Hyderabad - TSPCB",
    city: "Hyderabad",
  },
  {
    lat: 22.627847,
    lon: 88.380669,
    id: "site_296",
    name: "Rabindra Bharati University, Kolkata - WBPCB",
    city: "Kolkata",
  },
  {
    lat: 17.349694,
    lon: 78.451437,
    id: "site_298",
    name: "Zoo Park, Hyderabad - TSPCB",
    city: "Hyderabad",
  },
  {
    lat: 28.647622,
    lon: 77.315809,
    id: "site_301",
    name: "Anand Vihar, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 22.5448082,
    lon: 88.3403691,
    id: "site_309",
    name: "Victoria, Kolkata - WBPCB",
    city: "Kolkata",
  },
  {
    lat: 28.815329,
    lon: 77.15301,
    id: "site_5024",
    name: "Alipur, Delhi - DPCC",
    city: "Delhi",
  },
  {
    lat: 19.3832,
    lon: 72.8204,
    id: "site_5102",
    name: "Vasai West, Mumbai - MPCB",
    city: "Mumbai",
  },
  {
    lat: 19.0863,
    lon: 72.8888,
    id: "site_5104",
    name: "Kurla, Mumbai - MPCB",
    city: "Mumbai",
  },
  {
    lat: 19.10861,
    lon: 72.83622,
    id: "site_5106",
    name: "Vile Parle West, Mumbai - MPCB",
    city: "Mumbai",
  },
  {
    lat: 19.10078,
    lon: 72.87462,
    id: "site_5107",
    name: "Chhatrapati Shivaji Intl. Airport (T2), Mumbai - MPCB",
    city: "Mumbai",
  },
  {
    lat: 22.55664,
    lon: 88.342674,
    id: "site_5110",
    name: "Fort William, Kolkata - WBPCB",
    city: "Kolkata",
  },
  {
    lat: 22.49929,
    lon: 88.36917,
    id: "site_5111",
    name: "Jadavpur, Kolkata - WBPCB",
    city: "Kolkata",
  },
  {
    lat: 19.1375,
    lon: 72.915056,
    id: "site_5112",
    name: "Powai, Mumbai - MPCB",
    city: "Mumbai",
  },
  {
    lat: 19.2243333,
    lon: 72.8658113,
    id: "site_5113",
    name: "Borivali East, Mumbai - MPCB",
    city: "Mumbai",
  },
  {
    lat: 18.9936162,
    lon: 72.8128113,
    id: "site_5115",
    name: "Worli, Mumbai - MPCB",
    city: "Mumbai",
  },
  {
    lat: 19.047,
    lon: 72.8746,
    id: "site_5119",
    name: "Sion, Mumbai - MPCB",
    city: "Mumbai",
  },
  {
    lat: 18.91,
    lon: 72.82,
    id: "site_5120",
    name: "Colaba, Mumbai - MPCB",
    city: "Mumbai",
  },
  {
    lat: 22.51106,
    lon: 88.35142,
    id: "site_5126",
    name: "Rabindra Sarobar, Kolkata - WBPCB",
    city: "Mumbai",
  },
  {
    lat: 22.58157048,
    lon: 88.41002457,
    id: "site_5129",
    name: "Bidhannagar, Kolkata - WBPCB",
    city: "Kolkata",
  },
  {
    lat: 22.5367507,
    lon: 88.3638022,
    id: "site_5238",
    name: "Ballygunge, Kolkata - WBPCB",
    city: "Kolkata",
  },
  {
    lat: 28.656756,
    lon: 77.227234,
    id: "site_5393",
    name: "Chandni Chowk, Delhi - IITM",
    city: "Delhi",
  },
  {
    lat: 18.96702,
    lon: 72.84214,
    id: "site_5394",
    name: "Mazgaon, Mumbai - IITM",
    city: "Mumbai",
  },
  {
    lat: 28.588333,
    lon: 77.221667,
    id: "site_5395",
    name: "Lodhi Road, Delhi - IITM",
    city: "Delhi",
  },
  {
    lat: 19.04946,
    lon: 72.923,
    id: "site_5396",
    name: "Deonar, Mumbai - IITM",
    city: "Mumbai",
  },
  {
    lat: 19.1653323,
    lon: 72.922099,
    id: "site_5397",
    name: "Khindipada-Bhandup West, Mumbai - IITM",
    city: "Mumbai",
  },
  {
    lat: 18.897756,
    lon: 72.81332,
    id: "site_5398",
    name: "Navy Nagar-Colaba, Mumbai - IITM",
    city: "Mumbai",
  },
  {
    lat: 19.11074,
    lon: 72.86084,
    id: "site_5399",
    name: "Chakala-Andheri East, Mumbai - IITM",
    city: "Mumbai",
  },
  {
    lat: 19.23241,
    lon: 72.86895,
    id: "site_5400",
    name: "Borivali East, Mumbai - IITM",
    city: "Mumbai",
  },
  {
    lat: 19.19709,
    lon: 72.82204,
    id: "site_5402",
    name: "Malad West, Mumbai - IITM",
    city: "Mumbai",
  },
  {
    lat: 19.000083,
    lon: 72.813993,
    id: "site_5403",
    name: "Siddharth Nagar-Worli, Mumbai - IITM",
    city: "Mumbai",
  },
  {
    lat: 19.2058,
    lon: 72.8682,
    id: "site_5412",
    name: "Kandivali East, Mumbai - MPCB",
    city: "Mumbai",
  },
  {
    lat: 19.175,
    lon: 72.9419,
    id: "site_5413",
    name: "Mulund West, Mumbai - MPCB",
    city: "Mumbai",
  },
  {
    lat: 17.37206,
    lon: 78.50864,
    id: "site_5595",
    name: "New Malakpet, Hyderabad - TSPCB",
    city: "Hyderabad",
  },
  {
    lat: 17.470431,
    lon: 78.566959,
    id: "site_5596",
    name: "ECIL Kapra, Hyderabad - TSPCB",
    city: "Hyderabad",
  },
  {
    lat: 17.585705,
    lon: 78.126199,
    id: "site_5597",
    name: "IITH Kandi, Hyderabad - TSPCB",
    city: "Hyderabad",
  },
  {
    lat: 17.417094,
    lon: 78.457437,
    id: "site_5598",
    name: "Somajiguda, Hyderabad - TSPCB",
    city: "Hyderabad",
  },
  {
    lat: 17.544899,
    lon: 78.486949,
    id: "site_5599",
    name: "Kompally Municipal Office, Hyderabad - TSPCB",
    city: "Hyderabad",
  },
  {
    lat: 17.429398,
    lon: 78.569354,
    id: "site_5600",
    name: "Nacharam_TSIIC IALA, Hyderabad - TSPCB",
    city: "Hyderabad",
  },
  {
    lat: 17.528544,
    lon: 78.286195,
    id: "site_5602",
    name: "Ramachandrapuram, Hyderabad - TSPCB",
    city: "Hyderabad",
  },
  {
    lat: 17.393559,
    lon: 78.339194,
    id: "site_5604",
    name: "Kokapet, Hyderabad - TSPCB",
    city: "Hyderabad",
  },
  {
    lat: 12.921418,
    lon: 77.502466,
    id: "site_5678",
    name: "RVCE-Mailasandra, Bengaluru - KSPCB",
    city: "Bengaluru",
  },
  {
    lat: 13.003872,
    lon: 77.664217,
    id: "site_5681",
    name: "Kasturi Nagar, Bengaluru - KSPCB",
    city: "Bengaluru",
  },
  {
    lat: 13.0246342,
    lon: 77.5080115,
    id: "site_5686",
    name: "Shivapura_Peenya, Bengaluru - KSPCB",
    city: "Bengaluru",
  },
  {
    lat: 12.7816279,
    lon: 77.6299145,
    id: "site_5729",
    name: "Jigani, Bengaluru - KSPCB",
    city: "Bengaluru",
  },
  {
    lat: 19.1878657,
    lon: 72.8304069,
    id: "site_5807",
    name: "Mindspace-Malad West, Mumbai - MPCB",
    city: "Mumbai",
  },
  {
    lat: 19.065931,
    lon: 72.862131,
    id: "site_5810",
    name: "Bandra Kurla Complex, Mumbai - MPCB",
    city: "Mumbai",
  },
  {
    lat: 19.0364585,
    lon: 72.8954371,
    id: "site_5811",
    name: "Chembur, Mumbai - MPCB",
    city: "Mumbai",
  },
  {
    lat: 19.0632143,
    lon: 72.8456324,
    id: "site_5814",
    name: "Kherwadi_Bandra East, Mumbai - MPCB",
    city: "Mumbai",
  },
  {
    lat: 28.57834,
    lon: 77.184,
    id: "site_5852",
    name: "New Moti Bagh, Delhi - MHUA",
    city: "Delhi",
  },
  {
    lat: 18.9767,
    lon: 72.838,
    id: "site_5960",
    name: "Byculla, Mumbai - BMC",
    city: "Mumbai",
  },
  {
    lat: 19.060498,
    lon: 72.923356,
    id: "site_5961",
    name: "Shivaji Nagar, Mumbai - BMC",
    city: "Mumbai",
  },
  {
    lat: 19.215859,
    lon: 72.831718,
    id: "site_5962",
    name: "Kandivali West, Mumbai - BMC",
    city: "Mumbai",
  },
  {
    lat: 19.000084,
    lon: 72.85673,
    id: "site_5963",
    name: "Sewri, Mumbai - BMC",
    city: "Mumbai",
  },
  {
    lat: 19.083694,
    lon: 72.920967,
    id: "site_5964",
    name: "Ghatkopar, Mumbai - BMC",
    city: "Mumbai",
  },
];

// Data interfaces (unchanged)
interface LocationDetails {
  city: string;
  state?: string;
  country: string;
  formatted_address?: string;
}

export interface AQIData {
  aqi: number;
  station: string;
  city?: string;
  time: string;
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    so2?: number;
    co?: number;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  locationDetails?: LocationDetails;
}

// Cache duration & cache item interface
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

//
// AQIService class using only the new CSV-based API
//
export class AQIService {
  private static cache: Map<string, CacheItem<any>> = new Map();

  // Generic caching helper
  private static async fetchWithCache<T>(
    key: string,
    fetchFn: () => Promise<T>
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    try {
      const data = await fetchFn();
      this.cache.set(key, { data, timestamp: now });
      return data;
    } catch (error) {
      console.error("Cache fetch error:", error);
      throw error;
    }
  }

  // AQI breakpoints matching the new API (and Python logic)
  private static readonly aqiBreakpoints: Record<
    string,
    [number, number, number, number][]
  > = {
    "pm2.5cnc": [
      [0, 12, 0, 50],
      [12.1, 35.4, 51, 100],
      [35.5, 55.4, 101, 150],
      [55.5, 150.4, 151, 200],
      [150.5, 250.4, 201, 300],
      [250.5, 500.4, 301, 500],
    ],
    pm10cnc: [
      [0, 54, 0, 50],
      [55, 154, 51, 100],
      [155, 254, 101, 150],
      [255, 354, 151, 200],
      [355, 424, 201, 300],
      [425, 604, 301, 500],
    ],
    co: [
      [0, 4.4, 0, 50],
      [4.5, 9.4, 51, 100],
      [9.5, 12.4, 101, 150],
      [12.5, 15.4, 151, 200],
      [15.5, 30.4, 201, 300],
      [30.5, 50.4, 301, 500],
    ],
    no2ppb: [
      [0, 53, 0, 50],
      [54, 100, 51, 100],
      [101, 360, 101, 150],
      [361, 649, 151, 200],
      [650, 1249, 201, 300],
      [1250, 2049, 301, 500],
    ],
    so2: [
      [0, 35, 0, 50],
      [36, 75, 51, 100],
      [76, 185, 101, 150],
      [186, 304, 151, 200],
      [305, 604, 201, 300],
      [605, 1004, 301, 500],
    ],
    o3ppb: [
      [0, 54, 0, 50],
      [55, 70, 51, 100],
      [71, 85, 101, 150],
      [86, 105, 151, 200],
      [106, 200, 201, 300],
    ],
  };

  // Calculate AQI for a pollutant given its concentration
  private static calculateAqi(
    concentration: number,
    pollutant: string
  ): number | null {
    const breakpoints = this.aqiBreakpoints[pollutant];
    if (!breakpoints) return null;
    for (const [concLow, concHigh, aqiLow, aqiHigh] of breakpoints) {
      if (concentration >= concLow && concentration <= concHigh) {
        const aqi =
          ((aqiHigh - aqiLow) / (concHigh - concLow)) *
            (concentration - concLow) +
          aqiLow;
        return Math.round(aqi);
      }
    }
    return null;
  }

  // Helper: parse CSV text into an array of objects
  private static parseCSV(csvText: string): any[] {
    const rows = csvText
      .trim()
      .split("\n")
      .map((row) => row.split(","));
    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      const obj: any = {};
      headers.forEach((header, i) => {
        obj[header] = row[i] === "NaN" ? NaN : parseFloat(row[i]) || row[i];
      });
      return obj;
    });
    return data;
  }

  // Fetch CSV data from the new API using the given siteId and date range
  private static async fetchCSVData(
    siteId: string,
    startDate: string,
    endDate: string
  ): Promise<any[]> {
    const url = `${NEW_API_BASE_URL}/${siteId}/params/${NEW_API_PARAMS}/startdate/${startDate}/enddate/${endDate}/ts/hh/avg/1/api/${NEW_API_KEY}?gaps=1&gap_value=NaN`;
    console.log("Fetching new API data from:", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    return this.parseCSV(csvText);
  }

  // Convert CSV data to AQIData format
  private static async getNewAPIAQIBySiteId(
    siteId: string,
    startDate: string,
    endDate: string
  ): Promise<AQIData> {
    return this.fetchWithCache(
      `newAPI:${siteId}:${startDate}:${endDate}`,
      async () => {
        const dataRows = await this.fetchCSVData(siteId, startDate, endDate);
        if (!dataRows || dataRows.length === 0) {
          throw new Error("No data returned from new API");
        }

        // Compute average pollutant concentrations
        const pollutantAverages: Record<string, number> = {};
        for (const pollutant of Object.keys(this.aqiBreakpoints)) {
          const values = dataRows
            .map((row) => row[pollutant])
            .filter((v: number) => !isNaN(v));
          if (values.length) {
            pollutantAverages[pollutant] =
              values.reduce((a: number, b: number) => a + b, 0) / values.length;
          } else {
            pollutantAverages[pollutant] = NaN;
          }
        }

        // Calculate AQI for each pollutant and determine final AQI (max)
        const pollutantAqis: Record<string, number> = {};
        for (const [pollutant, avg] of Object.entries(pollutantAverages)) {
          const aqi = this.calculateAqi(avg, pollutant);
          if (aqi !== null) {
            pollutantAqis[pollutant] = aqi;
          }
        }
        const finalAqi = Math.max(...Object.values(pollutantAqis));

        // Lookup site details from SITE_LIST
        const siteInfo = SITE_LIST.find((site) => site.id === siteId);
        if (!siteInfo) {
          throw new Error("Site info not found for siteId " + siteId);
        }

        // Build the AQIData object
        const aqiData: AQIData = {
          aqi: finalAqi,
          station: siteInfo.name,
          city: siteInfo.city,
          time: new Date().toISOString(),
          pollutants: {
            pm25: pollutantAverages["pm2.5cnc"] || 0,
            pm10: pollutantAverages["pm10cnc"] || 0,
            o3: pollutantAverages["o3ppb"] || 0,
            no2: pollutantAverages["no2ppb"] || 0,
            so2: pollutantAverages["so2"] || 0,
            co: pollutantAverages["co"] || 0,
          },
          location: {
            latitude: siteInfo.lat,
            longitude: siteInfo.lon,
          },
        };
        return aqiData;
      }
    );
  }

  // Helper: get default date range (last 24 hours)
  private static getDefaultDateRange(): { startDate: string; endDate: string } {
    const now = new Date();
    const endDate = now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
    const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16);
    return { startDate, endDate };
  }

  // Given lat,lon find the nearest site from SITE_LIST and fetch its AQI data
  static async getNearestStation(lat: number, lon: number): Promise<AQIData> {
    // Simple haversine distance calculation
    function haversine(
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ): number {
      const toRad = (x: number) => (x * Math.PI) / 180;
      const R = 6371; // km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    let nearestSite: Site | undefined;
    let minDist = Infinity;
    for (const site of SITE_LIST) {
      const dist = haversine(lat, lon, site.lat, site.lon);
      if (dist < minDist) {
        minDist = dist;
        nearestSite = site;
      }
    }
    if (!nearestSite) {
      throw new Error("No site found near the provided coordinates.");
    }
    const { startDate, endDate } = this.getDefaultDateRange();
    return this.getNewAPIAQIBySiteId(nearestSite.id, startDate, endDate);
  }

  // Search for sites by query (filtering on site name or city) and fetch AQI data for each matching site
  static async searchStations(query: string): Promise<AQIData[]> {
    const filteredSites = SITE_LIST.filter(
      (site) =>
        site.name.toLowerCase().includes(query.toLowerCase()) ||
        site.city.toLowerCase().includes(query.toLowerCase())
    );
    const { startDate, endDate } = this.getDefaultDateRange();
    return Promise.all(
      filteredSites.map((site) =>
        this.getNewAPIAQIBySiteId(site.id, startDate, endDate)
      )
    );
  }
}
