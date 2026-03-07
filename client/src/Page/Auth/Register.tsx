import { useState } from "react"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { useAuth } from "../../Hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()
    setError("")
    setLoading(true)

    try {

      const success = await login(email, password)

      if (success) {
        navigate("/dashboard")
        return
      }

      setError("Email o contraseña incorrectos")

    } catch (error: any) {

      setError("Error de conexión con el servidor")

    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-400 p-10 rounded-lg">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-zinc-900 dark:text-zinc-200 leading-tight tracking-tight">
            Iniciar sesión
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Ingresá tus credenciales para continuar</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border rounded-lg p-2 border-zinc-200 dark:border-zinc-400 pb-2 pt-1 text-sm text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-200 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border rounded-lg p-2 border-zinc-200 dark:border-zinc-400 pb-2 pt-1 text-sm text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-200 transition-colors pr-8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-zinc-900 dark:bg-zinc-200 text-zinc-50 dark:text-zinc-800 text-xs font-medium uppercase tracking-widest py-3.5 flex items-center justify-center gap-2 hover:bg-zinc-700 dark:hover:bg-zinc-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border border-zinc-500 border-t-zinc-100 rounded-full animate-spin" />
            ) : (
              <>Entrar <ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="flex justify-between mt-6">
          <Link to="/forgot-password" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
            ¿Olvidaste tu contraseña?
          </Link>
          <Link to="/register" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
            Crear cuenta
          </Link>
        </div>

      </div>
    </div>
  )
}