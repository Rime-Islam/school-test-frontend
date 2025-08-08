import { useForm } from "react-hook-form";
import { AlertCircle, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useResendEmailOtpMutation,
  useVerifyEmailOtpMutation,
} from "../../redux/features/user/userApi";

interface VerifyEmailInputs {
  verificationCode: string;
}

const VerifyEmail = () => {
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailInputs>();

  const [verifyEmail] = useVerifyEmailOtpMutation();
  const [resendEmailOtp] = useResendEmailOtpMutation();

  const onSubmit = async (data: VerifyEmailInputs) => {
    setIsLoading(true);
    setServerError("");
    if (!email) {
      setServerError("Email address not found");
      return;
    }
    try {
      const res = await verifyEmail({
        email: email || "",
        otp: data.verificationCode,
      }).unwrap();

      if (res.success) {
        toast.success(res.message);
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      }
    } catch (error: any) {
      setServerError(
        error.data?.message || "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) return;

    try {
      const response = await resendEmailOtp({ email }).unwrap();
      toast.success(
        response.message || "Verification code resent successfully"
      );
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to resend verification code");
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="space-y-1 px-6 pb-2 pt-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Verify Your Email
          </h1>
          <p className="text-sm text-neutral-500">
            We've sent a verification code to {email}
          </p>
        </div>

        <div className="space-y-6 px-6 pb-6">
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
            {/* Verification Code */}
            <div>
              <label
                htmlFor="verificationCode"
                className="mb-1.5 block text-sm font-medium text-neutral-700"
              >
                Verification Code
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="verificationCode"
                  type="text"
                  placeholder="Enter 6-digit code"
                  autoComplete="one-time-code"
                  className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pl-9 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  {...register("verificationCode", {
                    required: "Verification code is required",
                    pattern: {
                      value: /^\d{6}$/,
                      message: "Must be a 6-digit code",
                    },
                  })}
                />
              </div>
              {errors.verificationCode && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.verificationCode.message}
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
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </button>
            </div>
          </form>

          <div className="text-center text-sm text-neutral-500">
            <p>Didn't receive a code?</p>
            <button
              type="button"
              className="font-medium text-neutral-900 hover:underline"
              onClick={handleResendOTP}
            >
              Resend verification code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
