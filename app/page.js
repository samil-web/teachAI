import ButtonSignin from "@/components/ButtonSignin";

export default function Page() {
  return (
    <>
      <header className="p-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-bold text-xl">TeachAI</span>
        </div>
        <ButtonSignin text="Get Started" />
      </header>
      <main>
        <section className="flex flex-col items-center justify-center text-center gap-8 px-8 py-24 min-h-[60vh]">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
              TeachAI
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              This app helps teachers teach with AI
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/lesson-builder" className="btn btn-primary btn-lg px-8">
                Start Creating Lesson Plans
              </a>
              <button className="btn btn-outline btn-lg px-8">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
