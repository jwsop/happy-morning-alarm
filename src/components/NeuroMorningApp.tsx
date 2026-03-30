import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { Play, Pause, Upload, Clock, Smile } from 'lucide-react';

export default function NeuroMorningApp() {
  const [alarmTime, setAlarmTime] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [age, setAge] = useState('');
  const [style, setStyle] = useState('Energetic');
  const [language, setLanguage] = useState('Korean');
  const [message, setMessage] = useState('');
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [musicUrl, setMusicUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAlarmTriggered, setIsAlarmTriggered] = useState(false);
  const [isArmed, setIsArmed] = useState(false);

  const generatePostcard = async () => {
    const aiText = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const prompt = `Act as Angelina, a supportive friend who is always cheering for the user. Create a single, short, and empowering quote for a ${age}-year-old person who prefers a ${style} style to start their day. The quote should be designed to make the user feel happy and energized. Write the quote in ${language}. Use markdown.`;
    const textResponse = await aiText.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    const text = textResponse.text || '';
    setMessage(text);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMusicFile(file);
      setMusicUrl(URL.createObjectURL(file));
    }
  };

  const startAlarm = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Autoplay blocked:", e));
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isAlarmTriggered && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Autoplay blocked:", e));
      setIsPlaying(true);
    }
  }, [isAlarmTriggered]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setCurrentTime(timeStr);
      if (timeStr === alarmTime && isArmed && !isAlarmTriggered) {
        setIsAlarmTriggered(true);
        generatePostcard();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [alarmTime, isArmed, isAlarmTriggered]);

  return (
    <div className="min-h-screen bg-stone-50 p-6 font-sans text-stone-900">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Smile className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold tracking-tighter">해피 모닝 알람</h1>
        </div>
        <div className="text-xl font-mono font-semibold text-stone-600">
          Current Time: {currentTime}
        </div>
      </header>

      {/* Removed API Key check UI */}

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Clock className="h-5 w-5" /> Alarm Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-600">Time</label>
              <input
                type="time"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                className="w-full rounded-lg border-2 border-blue-500 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-600">Age</label>
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-lg border-2 border-green-500 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-600">Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-lg border-2 border-blue-500 p-2"
              >
                <option>Energetic</option>
                <option>Calm</option>
                <option>Reflective</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-500 p-2"
              >
                <option>Korean</option>
                <option>English</option>
                <option>Japanese</option>
                <option>Chinese</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-600">Music</label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-yellow-500 p-2 hover:bg-stone-100">
                <Upload className="h-5 w-5 text-yellow-600" />
                <span className="text-yellow-600">{musicFile ? musicFile.name : 'Upload Music'}</span>
                <input type="file" accept="audio/mp3,audio/wav,audio/ogg,audio/m4a" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            <button
              onClick={() => setIsArmed(!isArmed)}
              className={`w-full rounded-lg px-4 py-2 font-semibold text-white ${
                isArmed ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {isArmed ? 'Deactivate Alarm' : 'Activate Alarm'}
            </button>
            {isArmed && <p className="text-sm text-green-600">Alarm is armed and waiting...</p>}
          </div>
        </div>

        {isAlarmTriggered && (
          <div className="rounded-2xl bg-orange-50 p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-orange-900">Angelina's Message</h2>
            <div className="mx-auto max-w-sm rounded-lg border-8 border-white bg-white p-4 shadow-xl">
              <div className="prose prose-orange">
                <ReactMarkdown>{message}</ReactMarkdown>
              </div>
            </div>
            {musicUrl && (
              <div className="mt-6 flex flex-col items-center gap-4">
                <audio ref={audioRef} src={musicUrl} loop />
                {!isPlaying && (
                  <button
                    onClick={startAlarm}
                    className="w-full rounded-lg bg-orange-600 px-6 py-4 text-lg font-bold text-white hover:bg-orange-700"
                  >
                    Play Music & View Postcard
                  </button>
                )}
                {isPlaying && (
                  <button
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.pause();
                        setIsPlaying(false);
                      }
                      setIsAlarmTriggered(false);
                    }}
                    className="rounded-lg bg-stone-200 px-4 py-2 hover:bg-stone-300"
                  >
                    Stop Alarm
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
