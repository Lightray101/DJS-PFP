import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme === "dark" ? "#333" : "#f0f0f0",
        border: `2px solid ${theme === "dark" ? "#555" : "#ddd"}`,
        borderRadius: "50%",
        width: "44px",
        height: "44px",
        fontSize: 20,
        cursor: "pointer",
        color: theme === "dark" ? "#ffd700" : "#ff6b35",
        transition: "all 0.3s ease",
        marginRight: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          theme === "dark"
            ? "0 2px 8px rgba(0,0,0,0.3)"
            : "0 2px 8px rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow =
          theme === "dark"
            ? "0 4px 16px rgba(255,215,0,0.3)"
            : "0 4px 16px rgba(255,107,53,0.3)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow =
          theme === "dark"
            ? "0 2px 8px rgba(0,0,0,0.3)"
            : "0 2px 8px rgba(0,0,0,0.1)";
      }}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span
        style={{
          transition: "transform 0.3s ease",
          transform: theme === "dark" ? "rotate(0deg)" : "rotate(180deg)",
        }}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
