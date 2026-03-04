export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-auto">
      <div className="mx-auto max-w-3xl px-6 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Your Name
      </div>
    </footer>
  );
}
