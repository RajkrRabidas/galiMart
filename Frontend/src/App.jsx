import AppRoutes from "./routes/AppRoutes";
import PageTitle from "./components/PageTitle";
import CapacitorBackButton from "./components/CapacitorBackButton";

function App() {
  return (
    <>
      <CapacitorBackButton />
      <PageTitle />
      <AppRoutes />
    </>
  );
}

export default App;