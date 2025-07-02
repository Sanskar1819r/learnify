import "./app.css";
import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationPage from "./pages/NotificationPage";
import SignUpPages from "./pages/SignUpPages";
import ChatPage from "./pages/ChatPage";
import CallPage from "./pages/CallPage";
import OnboardPage from "./pages/OnboardPage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
      return res.data;
    },
  });

  console.log(data);
  console.log({ isLoading });
  console.log({ error });
  return (
    <>
      <div className=" h-screen" data-theme="night">
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/signup" element={<SignUpPages />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/notification" element={<NotificationPage />}></Route>
          <Route path="/chat" element={<ChatPage />}></Route>
          <Route path="/call" element={<CallPage />}></Route>
          <Route path="/onboard" element={<OnboardPage />}></Route>
        </Routes>
        <Toaster position="top-center" />
      </div>
    </>
  );
}

export default App;
