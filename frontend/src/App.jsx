import React from "react";
import ReactDOM from "react-dom/client";

const referralUrl = "https://yourdynamicreferralsystem.com/?ref=GambaCodez"; // Replace with actual dynamic source

const App = () => (
  <div className="p-4 text-center">
    <h1 className="text-2xl font-bold">🎰 Welcome to GambleCodez</h1>
    <p>Sign up and claim bonuses using the links below!</p>
    <a
      href={referralUrl}
      className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded"
      target="_blank"
      rel="noopener noreferrer"
    >
      Join Now
    </a>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
