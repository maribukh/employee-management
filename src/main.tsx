import ReactDOM from "react-dom/client";
import App from "./App"; // или другой путь к вашему компоненту App

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
