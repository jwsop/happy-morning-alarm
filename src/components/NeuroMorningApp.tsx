import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Play, Pause, Upload, Clock, Smile } from 'lucide-react';

const quotes = [
  "Your day will shine as bright as your voice.",
  "Cheering for your new beginning.",
  "You are doing great.",
  "Your smile lights up the world today.",
  "Today will be happier than yesterday.",
  "You are a precious person.",
  "Wishing you a day full of good things.",
  "Take one more step toward your dreams.",
  "May your day be peaceful.",
  "You are stronger than you think.",
  "Cheering for your passion today.",
  "You are growing every single day.",
  "May your day be filled with joy.",
  "Your existence itself is a gift.",
  "Your efforts will shine today.",
  "You deserve to be loved.",
  "May your day shine beautifully.",
  "Your dreams will surely come true.",
  "May your heart be at ease today.",
  "You are a special person.",
  "May your day be vibrant.",
  "Cheering for your challenges.",
  "May your laughter never end today.",
  "You are deeply loved.",
  "May your day be filled with happiness.",
  "Your future is bright.",
  "May all your work go well today.",
  "You are always a wonderful person.",
  "May your day be blessed.",
  "Never give up on your dreams.",
  "May your heart be warm today.",
  "You are a precious being.",
  "May your day be enjoyable.",
  "I believe in your efforts.",
  "May every moment of your day be precious.",
  "You are always a shining person.",
  "May your day be peaceful.",
  "Move forward toward your dreams.",
  "May you feel good today.",
  "You have special abilities.",
  "May your day be successful.",
  "I believe in your passion.",
  "May all your wishes come true today.",
  "You are always a beautiful person.",
  "May your day be energetic.",
  "Cheering for your dreams.",
  "May your heart be calm today.",
  "You are a person of great value.",
  "May your day be happy.",
  "Cheering for your future."
];

export default function NeuroMorningApp() {
  const [name, setName] = useState(localStorage.getItem('userName') || '');
  const [streak, setStreak] = useState(parseInt(localStorage.getItem('streak') || '0'));
  const [totalCount, setTotalCount] = useState(parseInt(localStorage.getItem('totalCount') || '0'));
  const [alarmTime, setAlarmTime] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [message, setMessage] = useState('');
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [musicUrl, setMusicUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAlarmTriggered, setIsAlarmTriggered] = useState(false);
  const [isArmed, setIsArmed] = useState(false);

  useEffect(() => {
    localStorage.setItem('userName', name);
  }, [name]);

  const updateStats = () => {
    const today = new Date().toDateString();
    const lastUsed = localStorage.getItem('lastUsedDate');

    if (today === lastUsed) return;

    let newStreak = streak;
    if (lastUsed === new Date(Date.now() - 86400000).toDateString()) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    const newTotal = totalCount + 1;
    setStreak(newStreak);
    setTotalCount(newTotal);
    localStorage.setItem('streak', newStreak.toString());
    localStorage.setItem('totalCount', newTotal.toString());
    localStorage.setItem('lastUsedDate', today);
  };

  const generatePostcard = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setMessage(randomQuote);
    updateStats();
  };

  const handleShare = () => {
    const text = `${name ? `${name}, ` : ''}${message}`;
    if (navigator.share) {
      navigator.share({ title: 'Happy Morning Alarm', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
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
          <h1 className="text-3xl font-bold tracking-tighter">Happy Morning Ritual</h1>
        </div>
        <div className="text-xl font-mono font-semibold text-stone-600">
          {currentTime}
        </div>
      </header>

      <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border-2 border-stone-200 p-2"
          />
          <div className="flex gap-4 text-sm font-semibold text-stone-600">
            <span>🔥 Streak: {streak} days</span>
            <span>✨ Total: {totalCount} times</span>
          </div>
        </div>
      </div>

      {/* Removed API Key check UI */}

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Clock className="h-5 w-5" /> Morning Settings
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
              {isArmed ? 'Stop Morning' : 'Start Morning'}
            </button>
            {isArmed && <p className="text-sm text-green-600">Morning ritual is armed and waiting...</p>}
          </div>
        </div>

        {isAlarmTriggered && (
          <div className="rounded-2xl bg-orange-50 p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-orange-900">
              {name ? `${name}, ` : ''}Angelina's Message
            </h2>
            <div className="mx-auto max-w-sm rounded-lg border-8 border-white bg-white p-4 shadow-xl">
              <div className="prose prose-orange">
                <ReactMarkdown>{message}</ReactMarkdown>
              </div>
              <button
                onClick={handleShare}
                className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Share This Message
              </button>
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
                    Stop Ritual
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
