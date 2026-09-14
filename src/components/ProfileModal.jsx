import React, { useState, useRef, useEffect } from 'react';
import { User, Calendar, Scale, Ruler, Flame, X, Save, Sparkles, Zap, Scissors, Dumbbell, Sliders, Camera, Upload, Smile } from 'lucide-react';
import { TRANSLATIONS } from '../constants/translations';

export default function ProfileModal({ profile = {}, onSave, onClose, lang = 'IT' }) {
  const t = (TRANSLATIONS[lang] || TRANSLATIONS.IT).profile;
  const isEn = lang === 'EN';
  const fileInputRef = useRef(null);

  const safeTargets = profile.targets || { calories: 2500, protein: 180, fats: 70, carbs: 280 };

  const [name, setName] = useState(profile.name || 'Ivan');
  const [avatar, setAvatar] = useState(profile.avatar || '⚡'); // Emoji or image URL
  const [customEmoji, setCustomEmoji] = useState('');
  const [dob, setDob] = useState(profile.dob || '1995-06-15');
  const [height, setHeight] = useState(profile.height || 180);
  const [weight, setWeight] = useState(profile.weight || 80);

  const [bodyType, setBodyType] = useState(profile.bodyType || 'fit');
  const [preset, setPreset] = useState(profile.preset || 'auto');

  const [calories, setCalories] = useState(safeTargets.calories || 2500);
  const [protein, setProtein] = useState(safeTargets.protein || 180);
  const [fats, setFats] = useState(safeTargets.fats || 70);
  const [carbs, setCarbs] = useState(safeTargets.carbs || 280);

  // Neutral Preset Emojis
  const presetEmojis = ['⚡', '🥑', '🏋️', '🚀', '🦁', '🐺', '🏆', '💎', '🐉', '🤖', '🎯', '🍉', '🧘', '🦊'];

  const isImageAvatar = avatar && (avatar.startsWith('http') || avatar.startsWith('data:image'));

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const calculateAge = (dobStr) => {
    if (!dobStr) return 31;
    try {
      const birth = new Date(dobStr);
      if (isNaN(birth.getTime())) return 31;
      const today = new Date(2026, 8, 14);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age > 0 ? age : 31;
    } catch {
      return 31;
    }
  };

  const currentAge = calculateAge(dob);

  const bodyTypes = [
    {
      id: 'skinny',
      label: isEn ? 'Skinny / Lean' : 'Snello / Magro',
      icon: Zap,
      color: 'text-cyan-500 border-cyan-500/30 bg-cyan-500/10',
      description: isEn ? 'Lean build / fast metabolism' : 'Struttura esile, massa grassa bassa'
    },
    {
      id: 'fit',
      label: isEn ? 'Fit / Athletic' : 'In Forma / Atletico',
      icon: Flame,
      color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
      description: isEn ? 'Athletic build & muscle tone' : 'Muscoloso, tonico, buona forma'
    },
    {
      id: 'average',
      label: isEn ? 'Average' : 'Medio / Normotipo',
      icon: Scale,
      color: 'text-amber-500 border-amber-500/30 bg-amber-500/10',
      description: isEn ? 'Standard body structure' : 'Corporatura media bilanciata'
    },
    {
      id: 'chubby',
      label: isEn ? 'Chubby / Soft' : 'Robusto / Cicciottello',
      icon: Scale,
      color: 'text-rose-500 border-rose-500/30 bg-rose-500/10',
      description: isEn ? 'Overweight / Higher body fat' : 'Massa grassa elevata, morbido'
    }
  ];

  const applyPreset = (mode, currentW = weight, currentH = height, currentA = currentAge, type = bodyType) => {
    setPreset(mode);
    if (mode === 'custom') return;

    const w = Number(currentW) || 80;
    const h = Number(currentH) || 180;
    const a = Number(currentA) || 31;

    let activityMult = 1.45;
    if (type === 'skinny') activityMult = 1.55;
    else if (type === 'chubby') activityMult = 1.35;

    const bmr = 10 * w + 6.25 * h - 5 * a + 5;
    const tdee = Math.round(bmr * activityMult);

    let targetCal = tdee;
    let proGrams = Math.round(w * 2.0);
    let fatGrams = Math.round(w * 0.9);

    if (type === 'chubby') {
      proGrams = Math.round(w * 2.1);
      fatGrams = Math.round(w * 0.75);
    }

    if (mode === 'cut') {
      targetCal = Math.round(tdee - 500);
      proGrams = Math.round(w * 2.2);
      fatGrams = Math.round(w * 0.8);
    } else if (mode === 'bulk') {
      targetCal = Math.round(tdee + 300);
      proGrams = Math.round(w * 2.0);
      fatGrams = Math.round(w * 1.0);
    }

    const proCal = proGrams * 4;
    const fatCal = fatGrams * 9;
    const carbCal = Math.max(0, targetCal - proCal - fatCal);
    const carbGrams = Math.round(carbCal / 4);

    setCalories(targetCal);
    setProtein(proGrams);
    setFats(fatGrams);
    setCarbs(carbGrams);
  };

  useEffect(() => {
    if (preset !== 'custom') {
      applyPreset(preset, weight, height, currentAge, bodyType);
    }
  }, [weight, height, dob, bodyType]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedProfile = {
      name,
      avatar,
      dob,
      age: currentAge,
      height: Number(height),
      weight: Number(weight),
      bodyType,
      preset,
      targets: {
        calories: Number(calories),
        protein: Number(protein),
        fats: Number(fats),
        carbs: Number(carbs),
        micros: safeTargets.micros || {
          vitaminA: 900,
          vitaminC: 90,
          vitaminD: 20,
          iron: 14,
          calcium: 1000,
          zinc: 11,
          magnesium: 400,
          potassium: 3500
        }
      }
    };

    if (onSave) onSave(updatedProfile);
    if (onClose) onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto cursor-pointer"
    >
      {/* Modal Card Content */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto cursor-default"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
              {t.title}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {t.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Neutral Emoji / Photo Avatar Selector */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider block">
              {isEn ? 'Avatar Emoji & Profile Icon' : 'Emoji & Icona Profilo'}
            </span>

            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {isImageAvatar ? (
                  <img
                    src={avatar}
                    alt="Profile Avatar"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-3xl shadow-sm">
                    {avatar || '⚡'}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition-all"
                  title="Carica Foto Personalizzata"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5 flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                {/* Preset Neutral Emojis */}
                <div className="space-y-1">
                  <span className="text-[11px] text-zinc-400 font-semibold block">{isEn ? 'Select Neutral Emoji:' : 'Seleziona Emoji Neutra:'}</span>
                  <div className="flex flex-wrap gap-1.5 max-w-xs">
                    {presetEmojis.map((e, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(e)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg border transition-all ${
                          avatar === e
                            ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                            : 'border-zinc-200/70 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 hover:scale-110'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Write-in Emoji */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder={isEn ? "Custom emoji e.g. 🏎️" : "Emoji personalizzata es. 🏎️"}
                    value={customEmoji}
                    onChange={(e) => {
                      setCustomEmoji(e.target.value);
                      if (e.target.value.trim()) setAvatar(e.target.value.trim());
                    }}
                    className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-center w-36 font-semibold dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Upload Photo' : 'Carica Foto'}</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Name & DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">{t.name}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/70 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 text-sm font-semibold dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">{t.dob}</label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/70 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 text-sm font-semibold dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          {/* Age Calculated Badge */}
          <div className="p-3 bg-zinc-100/80 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-500" /> {t.age}:
            </span>
            <span className="font-extrabold text-sm font-mono text-zinc-900 dark:text-white">
              {currentAge} {t.yearsOld}
            </span>
          </div>

          {/* Height & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-indigo-500" /> {t.height}
              </label>
              <input
                type="number"
                required
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/70 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 text-sm font-mono font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-blue-500" /> {t.weight}
              </label>
              <input
                type="number"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/70 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 text-sm font-mono font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          {/* Body Build Cards */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider block">
              {isEn ? 'Current Physique / Body Build' : 'Stazza Corporea Attuale'}
            </span>

            <div className="grid grid-cols-2 gap-2">
              {bodyTypes.map((b) => {
                const Icon = b.icon;
                const isSelected = bodyType === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setBodyType(b.id);
                      applyPreset(preset, weight, height, currentAge, b.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white">
                        {b.label}
                      </span>
                      <div className={`p-1 rounded-lg ${b.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
                      {b.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Smart Preset Selector Buttons */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                {isEn ? 'Smart Macro Presets' : 'Preset Target Intelligenti'}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {isEn ? 'Calibrated for beginners' : 'Adatto ai meno esperti'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => applyPreset('auto')}
                className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                  preset === 'auto'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-700 hover:border-zinc-400'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Auto</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('cut')}
                className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                  preset === 'cut'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-700 hover:border-rose-400'
                }`}
              >
                <Scissors className="w-4 h-4" />
                <span>Cut</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('bulk')}
                className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                  preset === 'bulk'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-700 hover:border-indigo-400'
                }`}
              >
                <Dumbbell className="w-4 h-4" />
                <span>Bulk</span>
              </button>

              <button
                type="button"
                onClick={() => setPreset('custom')}
                className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                  preset === 'custom'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-700 hover:border-amber-400'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Custom</span>
              </button>
            </div>
          </div>

          {/* Custom Macro Targets */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">{t.targetCal}</label>
              <input
                type="number"
                required
                value={calories}
                onChange={(e) => { setCalories(e.target.value); setPreset('custom'); }}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200/80 dark:border-zinc-700 text-xs font-mono font-bold text-amber-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">{t.targetPro}</label>
              <input
                type="number"
                required
                value={protein}
                onChange={(e) => { setProtein(e.target.value); setPreset('custom'); }}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200/80 dark:border-zinc-700 text-xs font-mono font-bold text-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">{t.targetFat}</label>
              <input
                type="number"
                required
                value={fats}
                onChange={(e) => { setFats(e.target.value); setPreset('custom'); }}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200/80 dark:border-zinc-700 text-xs font-mono font-bold text-blue-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">{t.targetCarb}</label>
              <input
                type="number"
                required
                value={carbs}
                onChange={(e) => { setCarbs(e.target.value); setPreset('custom'); }}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200/80 dark:border-zinc-700 text-xs font-mono font-bold text-purple-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-bold rounded-2xl text-xs hover:bg-zinc-200 transition-all"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-zinc-900 hover:bg-black dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
            >
              <Save className="w-4 h-4" /> {t.save}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
