import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../ui/Button';
import { SERVICES } from '../../lib/services';

const UNSURE = 'Bilmayman — maslahat kerak';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: 'Ertalab (09:00 - 12:00)',
    treatmentType: UNSURE,
    notes: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#246B5B', '#DCEDE7', '#153F37', '#CBD3D8'],
      });
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 transition-all duration-300">
      <div className="relative w-full max-w-xl bg-[#0d1b26] rounded-2xl shadow-2xl border border-white/12 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-white/[0.04]">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#8fc7d4]" />
              <span className="text-[11px] font-semibold tracking-wider text-[#8fc7d4] uppercase">
                QABULGA YOZILISH
              </span>
            </div>
            <h3 className="mt-0.5 text-lg font-semibold tracking-tight text-white">
              Ko‘rikka yoziling — qo‘ng‘iroq qilib tasdiqlaymiz
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="flex flex-col items-center text-center py-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8fc7d4]/10 text-[#8fc7d4] mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-serif text-white">
                So&#39;rovingiz qabul qilindi
              </h4>
              <p className="mt-2 text-sm text-[#a7c2cb] max-w-md leading-relaxed">
                Rahmat, <strong className="text-white">{formData.fullName}</strong>. Administrator ish vaqtida 1–2 soat ichida <strong className="text-white">{formData.phone}</strong> raqamiga qo&#39;ng&#39;iroq qilib, qulay vaqtni kelishib oladi.
              </p>

              <div className="mt-6 w-full rounded-xl bg-white/[0.06] p-4 text-left border border-white/10 text-xs text-[#a7c2cb] space-y-1.5">
                <div className="font-semibold text-white flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#8fc7d4]" />
                  Birinchi tashrifda:
                </div>
                <div>• Shifokor ko&#39;rigi va kerak bo&#39;lsa raqamli rentgen</div>
                <div>• Davolash rejasi — bosqichlar, muddat va narx bilan</div>
                <div>• Savollaringizga javob; hech narsa majburlanmaydi</div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="white" onClick={handleReset}>
                  Tayyor
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#a7c2cb] mb-1.5">
                    To&#39;liq ism *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="masalan, Aziz Karimov"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-lg border border-white/12 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white placeholder-[#7f9aa4] focus:border-[#8fc7d4] focus:bg-white/[0.09] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#a7c2cb] mb-1.5">
                    Telefon raqami *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+998 90 000 00 00"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-white/12 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white placeholder-[#7f9aa4] focus:border-[#8fc7d4] focus:bg-white/[0.09] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#a7c2cb] mb-1.5">
                    Email manzil
                  </label>
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-white/12 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white placeholder-[#7f9aa4] focus:border-[#8fc7d4] focus:bg-white/[0.09] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#a7c2cb] mb-1.5">
                    Nima bo‘yicha?
                  </label>
                  <select
                    value={formData.treatmentType}
                    onChange={(e) => setFormData({ ...formData, treatmentType: e.target.value })}
                    className="w-full rounded-lg border border-white/12 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white placeholder-[#7f9aa4] focus:border-[#8fc7d4] focus:bg-white/[0.09] focus:outline-none transition-colors"
                  >
                    <option value={UNSURE}>{UNSURE}</option>
                    {SERVICES.map((s) => (
                      <option key={s.slug} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#a7c2cb] mb-1.5">
                    Afzal sana
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full rounded-lg border border-white/12 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white placeholder-[#7f9aa4] focus:border-[#8fc7d4] focus:bg-white/[0.09] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#a7c2cb] mb-1.5">
                    Vaqt afzalligi
                  </label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full rounded-lg border border-white/12 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white placeholder-[#7f9aa4] focus:border-[#8fc7d4] focus:bg-white/[0.09] focus:outline-none transition-colors"
                  >
                    <option value="Ertalab (09:00 - 12:00)">Ertalab (09:00 - 12:00)</option>
                    <option value="Kunduzi (12:00 - 16:00)">Kunduzi (12:00 - 16:00)</option>
                    <option value="Kechqurun (16:00 - 20:00)">Kechqurun (16:00 - 20:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a7c2cb] mb-1.5">
                  Shikoyat yoki savol (ixtiyoriy)
                </label>
                <textarea
                  rows={2}
                  placeholder="Masalan: pastki o'ng tish 3 kundan beri og'riyapti..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-lg border border-white/12 bg-white/[0.06] px-3.5 py-2 text-sm text-white placeholder-[#7f9aa4] focus:border-[#8fc7d4] focus:bg-white/[0.09] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="white"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                  icon={<ArrowRight className="h-4 w-4" />}
                >
                  {isSubmitting ? 'Saqlanmoqda...' : 'Konsultatsiya so’rash'}
                </Button>
              </div>

              <p className="text-[11px] text-center text-[#7f9aa4]">
                Ma&#39;lumotlaringiz faqat qabulni kelishish uchun ishlatiladi
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
