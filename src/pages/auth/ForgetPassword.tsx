import { Mail, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useRequestForgotPasswordOtpMutation } from "../../redux/features/auth/authApi";

interface ForgotPasswordInputs {
  email: string;
}

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [forgotPassword] = useRequestForgotPasswordOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>();

  const onSubmit = async (data: ForgotPasswordInputs) => {
    setIsLoading(true);
    try {
      const response = await forgotPassword({ email: data.email }).unwrap();
      if (response.success) {
        toast.success(response.message);
        setSuccess(true);
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to send reset instructions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="space-y-1 px-6 pb-2 pt-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            {success ? "Check your email" : "Forgot your password?"}
          </h1>
          <p className="text-sm text-neutral-500">
            {success
              ? "We've sent password reset instructions to your email"
              : "Enter your email to reset your password"}
          </p>
        </div>

        <div className="space-y-6 px-6 pb-6">
          {!success ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
                    placeholder="your@email.com"
                    autoComplete="email"
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="text-sm text-emerald-700">
                If you don't see the email, check your spam folder or{" "}
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="font-medium text-emerald-800 hover:underline"
                >
                  try another email address
                </button>
                .
              </p>
            </div>
          )}

          <p className="text-center text-xs text-neutral-500">
            Remember your password?{" "}
            <Link
              to="/auth/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;