import Header from "./components/Header";
import Hero from "./components/Hero";
import ProjectCard from "./components/ProjectCard";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />

      <main className="pt-32 px-6 max-w-4xl mx-auto">
        {/* ABOUT SECTION */}
        <section id="about" className="mb-32">
          <h2 className="text-4xl font-bold text-blue-700 mb-4">About Me</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            I am a third-year Computer Science student at Georgia Institute of Technology, passionate about building innovative software and applying machine learning, algorithms, and data science to solve real-world problems.
            I thrive in collaborative, fast-paced environments where I can turn complex ideas into impactful solutions.        
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mt-4">
            I'm especially interested in internships and roles in software engineering, machine learning, data science, quantitative research, and full-stack development, where I can leverage my technical and Mathematical skills to deliver scalable and impactful products.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mt-4">
            Outside of class, I run a STEM tutoring practice, providing one-on-one lessons to 10+ students per semester, combining my love for Math & Science with a drive to make education more accessible.
          </p>
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" className="mb-32">
          <h2 className="text-4xl font-bold text-blue-700 mb-4">Experience</h2>
          <p className="text-lg text-gray-700">
            Experience details coming soon.
          </p>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="mb-32">
          <h2 className="text-4xl font-bold text-blue-700 mb-8">Projects</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <ProjectCard
              title="Credit Card fraud detection"
              desc="Using machine learning algorithms to identify and prevent fraudulent credit card transactions."
              img="/credit-card-thief.png"
              link="https://github.gatech.edu/pages/ntrimait3/Machine-Learning-4641-Group-9/"
              tags={["Python", "Random Forest", "Logistic Regression", "Neural Networks"]}
            />

            <ProjectCard
              title="FPL Soccer Intelligence"
              desc="A web app that provides data-driven insights and predictions for Fantasy Premier League using player stats and interactive visualizations."
              img="/FPL.jpg"
              link="https://devfolio.co/projects/fpl-soccer-intelligence-a702"
              tags={["Python", "Tableau", "HTML/CSS", "Streamlit", "GPT Builder"]}
            />

            <ProjectCard
              title="GreenWise"
              desc="A chrome extension that allows customers to quickly assess the carbon impact of their online shopping."
              img="/GreenWise.jpg"
              link="https://devpost.com/software/greenwise-pwzv6u"
              tags={["beautiful-soup", "Flask", "JavaScript", "json", "numpy", "pandas", "python", "scikit-learn", "figma", "HTML/CSS", "jupyter-notebook"]}
            />
            
            <ProjectCard
              title="Yahtzee Bot"
              desc="A probability-optimized Yahtzee engine using expected value, dynamic simulations, and strategy heuristics. Beats most human players."
              img="/yahtzee.jpg"
              link="https://github.com/nitipon-ton/Yahtzee"
              tags={["Java", "Math", "Simulation", "Probability"]}
            />

            <ProjectCard
              title="Portfolio Website"
              desc="Aesthetic, animated Next.js portfolio built from scratch with Framer Motion, Tailwind CSS, and responsive design."
              img="/profile.jpg"
              link="#"
              tags={["Next.js", "React", "Tailwind", "Framer Motion"]}
            />
          </div>
        </section>

        {/* ACHIEVEMENTS SECTION */}
        <section id="achievements" className="mb-32">
          <h2 className="text-4xl font-bold text-blue-700 mb-4">Achievements</h2>
          <ul className="list-disc pl-6 text-gray-700 text-lg space-y-2">
            <li>
              PUTNAM Math Competition 2024 — 1st in Georgia Tech (#126 Overall):{" "}
              <a 
                href="https://kskedlaya.org/putnam-archive/AnnouncementOfWinners2024.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                results
              </a>
            </li>
            <li>King's Scholarship 2022 (Full Undergraduate Government Scholarship) (#1 in Thailand)</li>
            <li>
              International Earth Science Olympiad 2021 — Silver Medal:{" "}
              <a 
                href="https://www.igeoscied.org/wp-content/uploads/2022/11/2021-DMT_TOTAL-DISTINCTION-RANKING-IESO.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                results
              </a>
            </li>
            <li>
              Thailand Earth Science Olympiad 2021 — Gold Medal, Top Scorer in Theory, Practical, and Overall:{" "}
              <a 
                href="https://teso2021.mahidol.ac.th/medals.php"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline mr-3"
              >
                results
              </a>
              <a 
                href="https://www.youtube.com/watch?v=Nf3iNb-cXEk"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                video
              </a>
            </li>
            <li>
              International Teenagers Mathematics Olympiad 2019 — Gold Medal:{" "}
              <a 
                href="http://files.chiuchang.org.tw:8080/MyWeb/download/docu/ITMO%202019%20invitation.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline mr-3"
              >
                about
              </a>
            </li>
            <li>
              Bulgaria International Mathematics Competition 2018 — Silver Medal:{" "}
              <a 
                href="https://chiuchang.org/imc/en/2018/07/24/bimc-2018-results-2/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline mr-3"
              >
                results
              </a>
            </li>

          </ul>
        </section>

        {/* INTERVIEW SECTION */}
        <section id="interview" className="mb-32">
          <h2 className="text-4xl font-bold text-blue-700 mb-4">Interviews</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <ProjectCard
              title="OnDemand Interview (2022)"
              desc="A video interview focusing on my achievements in Math and Science National Admissions Exams."
              img="/OnDemand.jpg"
              link="https://www.youtube.com/watch?v=FBTvc63f00A"
              tags={["OnDemand", "Math", "Science", "Youtube"]}
            />

            <ProjectCard
              title="AtHome Interview (2022)"
              desc="A video interview focusing on my experiences and achievements in Math and Science Competitions before university."
              img="/AtHome.jpg"
              link="https://www.youtube.com/watch?v=ioI1tvJzJIQ"
              tags={["AtHome", "Math", "Science", "Youtube"]}
            />

            <ProjectCard
              title="Woody TV Interview (2016)"
              desc="A TV interview with Woody focusing on my latest achievements at IMSO 2016."
              img="/Woody.jpg"
              link="https://www.youtube.com/watch?v=3T3WGz0uphA"
              tags={["Woody", "Math", "IMSO 2016", "TV"]}
            />
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="mb-20">
          <h2 className="text-4xl font-bold text-blue-700 mb-4">Contact</h2>
          <ul className="text-lg text-gray-700">
            <li>Email: <span className="font-semibold">iamton2547@gmail.com</span></li>
            <li>
              Instagram:{" "}
              <a 
                href="https://www.instagram.com/nitipon_ton/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                nitipon_ton
              </a>
            </li>
            <li>
              LinkedIn:{" "}
              <a 
                href="https://www.linkedin.com/in/nitipon-tony/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                linkedin.com/in/nitipon-tony
              </a>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}