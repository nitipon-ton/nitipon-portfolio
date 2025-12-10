export default function Header() {
  return (
    <header className="w-full py-6 px-8 bg-blue-600 text-white fixed top-0 left-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold tracking-wide">
          Nitipon Trimaitreepituk
        </div>

        <nav className="flex gap-6 text-lg">
          <a href="#about" className="hover:underline">About</a>
          <a href="#experience" className="hover:underline">Experience</a>
          <a href="#projects" className="hover:underline">Projects</a>
          <a href="#achievements" className="hover:underline">Achievements</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </nav>
      </div>
    </header>
  );
}