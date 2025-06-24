import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900 p-4 sm:p-8">
      <div className="w-full max-w-xl bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold mb-2 text-center">About Fake Achievement Generator</h1>
        <p className="text-gray-700 dark:text-gray-200 text-lg text-center">
          The <span className="font-semibold">Fake Achievement Generator</span> lets you create hilarious, absurd, and creative achievements for any name and category. Powered by Google Gemini AI, it&apos;s perfect for sharing laughs with friends, spicing up your gaming sessions, or just having fun!
        </p>
        <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
          <h2 className="text-xl font-semibold mb-1">Contact</h2>
          <p className="text-gray-600 dark:text-gray-400">For questions or feedback, email <span className="font-mono">fake-achievements@example.com</span> (dummy address).</p>
        </div>
        <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline text-center">← Back to Generator</Link>
      </div>
    </div>
  );
} 