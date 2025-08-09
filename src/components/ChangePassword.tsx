import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { useChangePasswordMutation } from "../redux/features/auth/authApi";

interface ChangePasswordInputs {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [changePassword] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ChangePasswordInputs>();

  const onSubmit = async (data: ChangePasswordInputs) => {
    setIsLoading(true);
    try {
      const response = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      }).unwrap();
      
      if (response.success) {
        toast.success(response.message || "Password changed successfully");
        setSuccess(true);
        reset();
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="space-y-1 px-6 pb-2 pt-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            {success ? "Password changed!" : "Change your password"}
          </h1>
          <p className="text-sm text-neutral-500">
            {success
              ? "Your password has been updated successfully"
              : "Enter your current and new passwords"}
          </p>
        </div>

        <div className="space-y-6 px-6 pb-6">
          {!success ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Current Password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-1.5 block text-sm font-medium text-neutral-700"
                >
                  Current Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pl-9 pr-10 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    {...register("currentPassword", {
                      required: "Current password is required",
                    })}
                  />
                  <button
                    type="button"
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowCurrentPassword((s) => !s)}
                    className="absolute inset-y-0 right-1 inline-flex items-center rounded-md p-2 text-neutral-500 hover:bg-neutral-100"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-1.5 block text-sm font-medium text-neutral-700"
                >
                  New Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pl-9 pr-10 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      validate: (value) => 
                        value !== watch('currentPassword') || 
                        "New password must be different from current password"
                    })}
                  />
                  <button
                    type="button"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowNewPassword((s) => !s)}
                    className="absolute inset-y-0 right-1 inline-flex items-center rounded-md p-2 text-neutral-500 hover:bg-neutral-100"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-medium text-neutral-700"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pl-9 pr-10 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch('newPassword') || "Passwords do not match"
                    })}
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="absolute inset-y-0 right-1 inline-flex items-center rounded-md p-2 text-neutral-500 hover:bg-neutral-100"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.confirmPassword.message}
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
                      Updating...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="text-sm text-emerald-700">
                Your password has been updated successfully.{" "}
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="font-medium text-emerald-800 hover:underline"
                >
                  Change password again
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;