"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
        <h1 className="text-lg font-bold text-red-800">
          Verbindungsfehler · خطأ في الاتصال
        </h1>
        <p className="mt-2 text-sm text-red-700">
          Die Anmeldung ist momentan nicht möglich. Bitte versuchen Sie es später
          erneut.
        </p>
        <p dir="rtl" className="mt-1 text-sm text-red-700">
          تعذّر الاتصال بقاعدة البيانات في الوقت الحالي. يرجى المحاولة لاحقاً.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Erneut versuchen · إعادة المحاولة
        </button>
      </div>
    </div>
  );
}
