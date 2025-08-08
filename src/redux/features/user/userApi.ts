import { baseApi } from "../baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // register user
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/user/register",
        method: "POST",
        body: userData,
      }),
    }),
    // verify email
    verifyEmailOtp: builder.mutation({
      query: (data) => ({
        url: "/user/verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    // verify email
    resendEmailOtp: builder.mutation({
      query: (data) => ({
        url: "/user/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { 
    useRegisterUserMutation, 
    useVerifyEmailOtpMutation,
    useResendEmailOtpMutation, 
} = userApi;
