export type Lang = "de" | "ar";

const de = {
  orgName: "Al-Salam Lörrach",
  tagline: "Islamische Gemeinschaft",
  title: "Kinderbetreuung am Samstag",
  intro:
    "Liebe Mütter, wir suchen Unterstützung: Jeden Samstag begleiten wir die Kinder in den Kursen. Bitte tragen Sie sich in einen Zeitraum ein, in dem Sie die Aufsicht übernehmen können. Pro Zeitraum sind maximal 2 Helferinnen möglich.",
  howTo:
    "Name und Telefonnummer eingeben und auf „Reservieren“ drücken.",
  morning: "Vormittag",
  afternoon: "Nachmittag",
  morningTime: "10:30 – 12:30 Uhr",
  afternoonTime: "14:30 – 16:30 Uhr",
  nameLabel: "Name",
  namePlaceholder: "Ihr Name",
  phoneLabel: "Telefonnummer",
  phonePlaceholder: "z. B. +49 176 12345678",
  reserve: "Reservieren",
  sending: "Wird gesendet …",
  reserved: "Reserviert:",
  empty: "Noch frei",
  count: (n: number) => `${n} von 2 belegt`,
  remaining: (n: number) =>
    n === 1 ? "Noch 1 Platz frei" : `Noch ${n} Plätze frei`,
  full: "Belegt",
  success: "Vielen Dank! Ihre Reservierung wurde gespeichert.",
  errorRequired: "Bitte Name und Telefonnummer eingeben.",
  errorPhone: "Bitte eine gültige Telefonnummer eingeben.",
  errorFull: "Dieser Zeitraum ist leider schon voll.",
  errorDuplicate: "Sie haben diesen Zeitraum bereits reserviert.",
  errorInvalidSlot: "Ungültiger Zeitraum.",
  errorServer: "Es ist ein Fehler aufgetreten. Bitte erneut versuchen.",
  loading: "Wird geladen …",
  vacationNote:
    "In den Schulferien von Baden-Württemberg finden keine Samstagskurse statt.",
  langSwitch: "Sprache",
};

export type Dict = typeof de;

const ar: Dict = {
  orgName: "السلام لوراخ",
  tagline: "الجمعية الإسلامية",
  title: "رعاية الأطفال يوم السبت",
  intro:
    "أخواتنا الكريمات، نطلب مساعدتكن: في كل يوم سبت نرافق الأطفال في الدورات. يرجى حجز فترة زمنية يمكنكن فيها الإشراف على الأطفال. الحد الأقصى مساعدتان لكل فترة.",
  howTo: "اكتبي الاسم ورقم الهاتف ثم اضغطي على «احجز».",
  morning: "الفترة الصباحية",
  afternoon: "الفترة المسائية",
  morningTime: "10:30 – 12:30",
  afternoonTime: "14:30 – 16:30",
  nameLabel: "الاسم",
  namePlaceholder: "اسمك",
  phoneLabel: "رقم الهاتف",
  phonePlaceholder: "مثال: +49 176 12345678",
  reserve: "احجز",
  sending: "جارٍ الإرسال …",
  reserved: "المحجوزون:",
  empty: "لا يوجد حجز بعد",
  count: (n: number) => `${n} من 2 محجوز`,
  remaining: (n: number) => (n === 1 ? "متبقٍ مكان واحد" : `متبقٍ ${n} من 2`),
  full: "ممتلئ",
  success: "شكراً لك! تم حفظ حجزك.",
  errorRequired: "يرجى إدخال الاسم ورقم الهاتف.",
  errorPhone: "يرجى إدخال رقم هاتف صحيح.",
  errorFull: "هذه الفترة محجوزة بالكامل.",
  errorDuplicate: "لقد حجزت هذه الفترة مسبقاً.",
  errorInvalidSlot: "فترة غير صالحة.",
  errorServer: "حدث خطأ. يرجى المحاولة مرة أخرى.",
  loading: "جارٍ التحميل …",
  vacationNote: "لا تُقام دورات السبت خلال العطل المدرسية في بادن-فورتمبيرغ.",
  langSwitch: "اللغة",
};

export const dictionaries: Record<Lang, Dict> = { de, ar };

export const LANGS: { code: Lang; label: string }[] = [
  { code: "de", label: "Deutsch" },
  { code: "ar", label: "العربية" },
];

export function formatDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat(lang === "ar" ? "ar" : "de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
