import { useEffect, useState } from "react";

export default function Alert({ alert, setAlert }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer = null;

    if (alert.type === "error") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (alert.message) {
      setVisible(true);
      timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setAlert({}), 300); // wait for fade-out
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [alert.message]);

  if (!alert.message) return null;

  const baseClass =
    "capitalize flex justify-between align-center px-6 py-4 mb-4 text-base text-xl rounded-xl font-semibold shadow-lg transition-all duration-300 ease-in-out opacity-0 scale-95";
  const successClass =
    "text-green-800 bg-green-100 border border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700";
  const errorClass =
    "text-red-800 bg-red-100 border border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700";

  return (
    <div
      className={`${baseClass} ${
        alert.type === "success" ? successClass : errorClass
      } 
        ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      role="alert"
    >
      {alert.message}
      <div
        onClick={() => {
          setAlert({});
        }}
        className="text-sm bg-gray-200 rounded-4xl p-2 text-black cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out"
      >
        X
      </div>
    </div>
  );
}
