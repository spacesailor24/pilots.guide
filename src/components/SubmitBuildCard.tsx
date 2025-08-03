import LinkWithTransition from "./LinkWithTransition";

export default function SubmitBuildCard() {
  return (
    <LinkWithTransition href="/submit-build" className="group block">
      <div className="bg-black rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105 h-full p-4">
        <div className="h-full border-2 border-red-800 rounded-lg flex flex-col items-center justify-center p-8">
          <div className="text-8xl text-red-800 group-hover:text-red-500 transition-colors mb-4">
            +
          </div>
          <h3 className="text-xl font-bold text-red-800 group-hover:text-red-500 transition-colors">
            Submit a Build
          </h3>
        </div>
      </div>
    </LinkWithTransition>
  );
}