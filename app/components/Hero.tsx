export default function Hero() {
  return (
    <section
      id="hero"
      className="w-full min-h-screen flex flex-col md:flex-row items-center justify-center gap-10 px-8 pt-32"
    >
      {/* Photo */}
      <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg">
        <img
          src="/profile.jpg"
          alt="Profile Photo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text */}
      <div className="max-w-xl flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Nitipon Trimaitreepituk</h1>
        <p className="text-lg text-gray-600">
          CS Student at Georgia Tech • Software Engineer • Math Enthusiast
        </p>

        <a
          href="#experience"
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          View My Work Experience
        </a>

        <a
          href="#projects"
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          View My Projects
        </a>

        <a
          href="#interview"
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          Watch My Interviews
        </a>
      </div>
    </section>
  );
}