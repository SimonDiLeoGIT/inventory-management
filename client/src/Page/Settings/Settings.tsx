import { useState } from "react";
import { Profile } from "./Components/Profile";

export const Settings = () => {

  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          Configuración
        </h1>
        <p className="text-zinc-400 text-sm">
          Gestiona tu cuenta y preferencias
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-2 bg-zinc-800 p-1 rounded-lg w-fit">
        {[
          { id: "profile", label: "Perfil" },
          { id: "notifications", label: "Notificaciones" },
          { id: "security", label: "Seguridad" },
          { id: "system", label: "Sistema" }
        ].map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-1 rounded-md text-sm
                ${active
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-400 hover:text-white"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

        {activeTab === "profile" && (
          <Profile />
        )}

        {activeTab !== "profile" && (
          <div className="text-zinc-500 text-sm">
            Sección en construcción...
          </div>
        )}

      </div>
    </div>
  );
};