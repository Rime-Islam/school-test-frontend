import { useForm } from "react-hook-form";
import {
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import type { RegisterFormInputs } from "../../interface/user.interface";
import { useRegisterUserMutation } from "../../redux/features/user/userApi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");
  const [strength, setStrength] = useState(0);
  const [strengthPerc, setStrengthPerc] = useState(0);
  const [strengthColor, setStrengthColor] = useState("bg-red-500");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormInputs>();
  const [createUser] = useRegisterUserMutation();
  const navigate = useNavigate();

  // Password strength calculator (simplified version)
  const calculateStrength = (password: string) => {
    let score = 0;
    if (!password) return 0;

    // Length
    if (password.length > 8) score += 1;
    if (password.length > 12) score += 1;

    // Complexity
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return Math.min(score, 5);
  };

  const password = watch("password");
  if (password) {
    const newStrength = calculateStrength(password);
    if (newStrength !== strength) {
      setStrength(newStrength);
      setStrengthPerc(newStrength * 20);
      setStrengthColor(
        newStrength <= 2
          ? "bg-red-500"
          : newStrength === 3
          ? "bg-yellow-500"
          : "bg-green-500"
      );
    }
  }

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsLoading(true);
    setServerError("");
    setSuccess("");

    try {
      const res = await createUser({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();

      if (res.success) {
        toast.success(res.message);
        setTimeout(() => {
          navigate(`/auth/verify-email?email=${data.email}`);
        }, 1000);
      }
    } catch (error: any) {
      console.log(error);
      setServerError(
        error.data.message || "Something went wrong. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl ">
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="space-y-1 px-6 pb-2 pt-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-neutral-500">
            Join us by filling out your details below.
          </p>
        </div>

        <div className="space-y-6 px-6 pb-6">
          {success && (
            <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <p className="text-sm">{success}</p>
            </div>
          )}

          {serverError && (
            <div
              className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-red-700"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <p className="text-sm">{serverError}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-neutral-700"
              >
                Full Name
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  id="name"
                  type="text"
                  placeholder="Ada Lovelace"
                  autoComplete="name"
                  className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pl-9 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  {...register("name", { required: "Full name is required" })}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-neutral-700"
              >
                Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="ada@example.com"
                  autoComplete="email"
                  inputMode="email"
                  className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pl-9 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Password
                </label>
                <span className="text-xs text-neutral-500">
                  Min 8 chars, mixed case, number, symbol
                </span>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pl-9 pr-10 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-1 inline-flex items-center rounded-md p-2 text-neutral-500 hover:bg-neutral-100"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="mt-2 space-y-1">
                <div className="h-2 w-full rounded-full bg-neutral-100">
                  <div
                    className={`h-2 rounded-full ${strengthColor} transition-all`}
                    style={{ width: `${strengthPerc}%` }}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-xs text-neutral-500" aria-live="polite">
                  {strength <= 2 ? "Weak" : strength === 3 ? "Good" : "Strong"}
                </p>
              </div>

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-neutral-500">
            Already have an account?
            <Link to="/auth/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
