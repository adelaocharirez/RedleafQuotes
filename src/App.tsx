import { ProjectDetails } from "./components/ProjectDetails";
import { MaterialSection } from "./components/MaterialSection";
import { ConsumablesSection } from "./components/ConsumablesSection";

function App() {
  return (
    <div className="min-h-screen bg-paper p-4">
      <h1 className="font-display text-2xl text-ink mb-4">New Quote</h1>
      <ProjectDetails />
      <MaterialSection />
      <ConsumablesSection />
    </div>
  );
}

export default App;