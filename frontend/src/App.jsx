import { useState } from "react"
import axios from "axios"
import { Leaf, Languages } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const districts = [
  "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya",
  "Azamgarh", "Badaun", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda",
  "Barabanki", "Bareilly", "Basti", "Bijnor", "Bulandshahr", "Chandauli",
  "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad",
  "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur",
  "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj",
  "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar",
  "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau",
  "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh",
  "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar",
  "Sant Ravidas Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar",
  "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
]

const crops = [
  "Wheat", "Rice", "Sugarcane", "Maize", "Pulses", "Potato", "Mustard",
  "Barley", "Cotton", "Groundnut", "Millets", "Oilseeds", "Vegetables", "Fruits"
]

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function App() {
  const [form, setForm] = useState({ district: "", crop: "", month: "" })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [language, setLanguage] = useState("english")
  const [calendar, setCalendar] = useState(null)
  const [calLoading, setCalLoading] = useState(false)
  const [speaking, setSpeaking] = useState("")

  const cleanForSpeech = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/^\*\s*/gm, "")
      .replace(/^\-\s*/gm, "")
      .replace(/#{1,6}\s*/g, "")
      .replace(/\n+/g, " ")
      .trim()
  }

  const speak = (text, lang, id) => {
    if (window.responsiveVoice) window.responsiveVoice.cancel()
    window.speechSynthesis.cancel()

    if (speaking === id) {
      setSpeaking("")
      return
    }

    const cleaned = cleanForSpeech(text)
    setSpeaking(id)

    if (lang === "hindi" && window.responsiveVoice) {
      window.responsiveVoice.speak(cleaned, "Hindi Female", {
        onend: () => setSpeaking("")
      })
    } else {
      const utterance = new SpeechSynthesisUtterance(cleaned)
      utterance.lang = "en-IN"
      utterance.rate = 0.9
      utterance.onend = () => setSpeaking("")
      window.speechSynthesis.speak(utterance)
    }
  }

  const handlePredict = async () => {
    if (!form.district || !form.crop || !form.month) {
      setError(language === "hindi" ? "कृपया सभी विकल्प चुनें!" : "Please select all fields!")
      return
    }
    setError("")
    setLoading(true)
    setResult(null)
    window.speechSynthesis.cancel()
    setSpeaking("")
    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", { ...form, language })
      setResult(res.data)
    } catch (e) {
      setError(language === "hindi" ? "कुछ गलत हुआ। क्या बैकएंड चल रहा है?" : "Something went wrong. Is backend running?")
    }
    setLoading(false)
  }

  const handleCalendar = async () => {
    if (!form.district) {
      setError(language === "hindi" ? "पहले जिला चुनें!" : "Please select a district first!")
      return
    }
    setCalLoading(true)
    setCalendar(null)
    window.speechSynthesis.cancel()
    setSpeaking("")
    try {
      const res = await axios.post("http://127.0.0.1:8000/crop-calendar", {
        district: form.district,
        language
      })
      setCalendar(res.data.calendar)
    } catch (e) {
      setError("Calendar fetch failed!")
    }
    setCalLoading(false)
  }

  const renderText = (text) =>
    text
      .split("\n")
      .filter(line => line.trim() !== "")
      .map((line, i) => {
        const isBullet = line.trim().startsWith("*") || line.trim().startsWith("-")
        const cleaned = line.replace(/^[\*\-]\s*/, "")
        const parts = cleaned.split(/\*\*(.*?)\*\*/g)
        return (
          <div key={i} className={isBullet ? "flex gap-2 items-start" : ""}>
            {isBullet && <span className="text-green-400 mt-0.5">•</span>}
            <p>
              {parts.map((part, j) =>
                j % 2 === 1
                  ? <strong key={j} className="text-white">{part}</strong>
                  : part
              )}
            </p>
          </div>
        )
      })

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-xl">
              <Leaf size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {language === "hindi" ? "फसल उपज अनुमान" : "Crop Yield Predictor"}
              </h1>
              <p className="text-gray-400 text-sm">
                {language === "hindi" ? "उत्तर प्रदेश — AI संचालित" : "Uttar Pradesh — AI Powered"}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              window.speechSynthesis.cancel()
              setSpeaking("")
              setLanguage(language === "english" ? "hindi" : "english")
              setResult(null)
              setCalendar(null)
            }}
            className="flex items-center gap-2 bg-gray-800 border border-gray-700 hover:border-green-500 px-4 py-2 rounded-xl transition-all text-sm font-medium"
          >
            <Languages size={16} className="text-green-400" />
            {language === "english" ? "हिंदी" : "English"}
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-green-400">
            {language === "hindi" ? "विवरण चुनें" : "Select Details"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                {language === "hindi" ? "जिला" : "District"}
              </label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
                value={form.district}
                onChange={e => setForm({ ...form, district: e.target.value })}
              >
                <option value="">{language === "hindi" ? "जिला चुनें" : "Select District"}</option>
                {districts.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                {language === "hindi" ? "फसल" : "Crop"}
              </label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
                value={form.crop}
                onChange={e => setForm({ ...form, crop: e.target.value })}
              >
                <option value="">{language === "hindi" ? "फसल चुनें" : "Select Crop"}</option>
                {crops.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                {language === "hindi" ? "महीना" : "Month"}
              </label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
                value={form.month}
                onChange={e => setForm({ ...form, month: e.target.value })}
              >
                <option value="">{language === "hindi" ? "महीना चुनें" : "Select Month"}</option>
                {months.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>

          </div>

          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

          <button
            onClick={handlePredict}
            disabled={loading}
            className="mt-5 w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold py-3 rounded-xl transition-all duration-200"
          >
            {loading
              ? (language === "hindi" ? "⏳ डेटा प्राप्त हो रहा है..." : "⏳ Fetching live data & predicting...")
              : (language === "hindi" ? "🌾 उपज का अनुमान लगाएं" : "🌾 Predict Yield")}
          </button>

          <button
            onClick={handleCalendar}
            disabled={calLoading}
            className="mt-3 w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-green-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-200"
          >
            {calLoading
              ? (language === "hindi" ? "⏳ कैलेंडर लोड हो रहा है..." : "⏳ Loading Calendar...")
              : (language === "hindi" ? "🌱 फसल कैलेंडर देखें" : "🌱 View Crop Calendar")}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">

            {/* Weather Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                <p className="text-3xl mb-1">🌡️</p>
                <p className="text-2xl font-bold text-orange-400">{result.weather.temperature}°C</p>
                <p className="text-gray-400 text-sm">{language === "hindi" ? "तापमान" : "Temperature"}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                <p className="text-3xl mb-1">💧</p>
                <p className="text-2xl font-bold text-blue-400">{result.weather.humidity}%</p>
                <p className="text-gray-400 text-sm">{language === "hindi" ? "आर्द्रता" : "Humidity"}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                <p className="text-3xl mb-1">🌧️</p>
                <p className="text-2xl font-bold text-cyan-400">{result.weather.rainfall}mm</p>
                <p className="text-gray-400 text-sm">{language === "hindi" ? "वर्षा" : "Rainfall"}</p>
              </div>
            </div>

            {/* Live Condition */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <p className="text-gray-400 text-sm">
                {language === "hindi" ? "लाइव स्थिति" : "Live Condition"} — {result.district}
              </p>
              <p className="text-white capitalize font-medium">
                {result.weather.weather_desc} • {language === "hindi" ? "हवा" : "Wind"} {result.weather.wind_speed} m/s
              </p>
            </div>

            {/* Yield Result */}
            <div className="bg-green-950 border border-green-800 rounded-2xl p-6 text-center">
              <p className="text-gray-400 text-sm mb-1">
                {language === "hindi" ? `${result.crop} के लिए अनुमानित उपज` : `Predicted Yield for ${result.crop}`}
              </p>
              <p className="text-5xl font-bold text-green-400">{result.predicted_yield.toLocaleString()}</p>
              <p className="text-green-600 mt-1">{language === "hindi" ? "किलो / हेक्टेयर" : "kg / hectare"}</p>

              {result.weather.rainfall > 250 && (
                <div className="mt-4 bg-red-900 border border-red-700 rounded-xl px-4 py-2 text-red-300 text-sm">
                  ⚠️ {language === "hindi" ? "बाढ़ का खतरा — उचित जल निकासी सुनिश्चित करें!" : "Flood Risk Detected — Ensure proper drainage!"}
                </div>
              )}
              {result.weather.rainfall < 30 && (
                <div className="mt-4 bg-yellow-900 border border-yellow-700 rounded-xl px-4 py-2 text-yellow-300 text-sm">
                  ⚠️ {language === "hindi" ? "सूखे का खतरा — सिंचाई की सिफारिश!" : "Drought Risk — Irrigation recommended!"}
                </div>
              )}
            </div>

            {/* Weather Graph */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-green-400 font-semibold mb-4">
                📊 {language === "hindi" ? "मौसम अवलोकन" : "Weather Overview"}
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={[
                    { name: language === "hindi" ? "तापमान" : "Temperature", value: result.weather.temperature },
                    { name: language === "hindi" ? "आर्द्रता" : "Humidity", value: result.weather.humidity },
                    { name: language === "hindi" ? "वर्षा" : "Rainfall", value: result.weather.rainfall },
                    { name: language === "hindi" ? "हवा" : "Wind", value: result.weather.wind_speed },
                  ]}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* AI Advice */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-green-400 font-semibold">
                  🤖 {language === "hindi" ? "AI कृषि सलाह" : "AI Farming Advice"}
                </h3>
                <button
                  onClick={() => speak(result.ai_advice, language, "advice")}
                  className={`flex items-center gap-1 border px-3 py-1.5 rounded-lg text-sm transition-all ${
                    speaking === "advice"
                      ? "bg-green-700 border-green-500 text-white"
                      : "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300"
                  }`}
                >
                  {speaking === "advice" ? "⏹️" : "🔊"} {language === "hindi" ? "सुनें" : "Listen"}
                </button>
              </div>
              <div className="text-gray-300 text-sm leading-relaxed space-y-3">
                {renderText(result.ai_advice)}
              </div>
            </div>

          </div>
        )}

        {/* Crop Calendar */}
        {calendar && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-green-400 font-semibold">
                🌱 {language === "hindi" ? "फसल कैलेंडर" : "Crop Calendar"} — {form.district}
              </h3>
              <button
                onClick={() => speak(calendar, language, "calendar")}
                className={`flex items-center gap-1 border px-3 py-1.5 rounded-lg text-sm transition-all ${
                  speaking === "calendar"
                    ? "bg-green-700 border-green-500 text-white"
                    : "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300"
                }`}
              >
                {speaking === "calendar" ? "⏹️" : "🔊"} {language === "hindi" ? "सुनें" : "Listen"}
              </button>
            </div>
            <div className="space-y-2">
              {calendar
                .split("\n")
                .filter(line => line.trim() !== "")
                .map((line, i) => {
                  const colonIdx = line.indexOf(":")
                  const month = colonIdx !== -1 ? line.substring(0, colonIdx).trim() : line
                  const rest = colonIdx !== -1 ? line.substring(colonIdx + 1).trim() : ""
                  return (
                    <div key={i} className="flex gap-3 items-start bg-gray-800 rounded-xl px-4 py-3">
                      <span className="text-green-400 font-semibold min-w-28 text-sm">{month}</span>
                      <span className="text-gray-300 text-sm">{rest}</span>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
