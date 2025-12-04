import { useState, useEffect, useCallback } from "react";
import { authService } from "../services/auth/authService";

export function useAuth() {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      authService.initAuth();
      let state = authService.getAuthState();
      console.log(state);
      
      // Nếu có token nhưng chưa có user, hoặc user null, thì fetch lại user từ API
      if (state.token && !state.user) {
        const user = await authService.fetchCurrentUser();
        state = { ...state, user, isAuthenticated: !!user };
      }
      setAuthState({ ...state, isLoading: false });
    };
    console.log(authState);
    
    initAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        const newState = authService.getAuthState();
        setAuthState({ ...newState, isLoading: false });
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
      return response;
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.register(userData);
      if (response.success) {
        const newState = authService.getAuthState();
        setAuthState({ ...newState, isLoading: false });
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }

      return response;
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      await authService.logout();
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error("Logout error:", error);
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (userData) => {
    const response = await authService.updateProfile(userData);
    if (response.success) {
      const newState = authService.getAuthState();
      setAuthState((prev) => ({ ...prev, user: newState.user }));
    }
    return response;
  }, []);

  // Verify booking ownership
  const verifyBookingOwnership = useCallback(async (bookingId, credentials) => {
    return await authService.verifyBookingOwnership(bookingId, credentials);
  }, []);

  // Send phone OTP
  const sendPhoneOTP = useCallback(async (phoneNumber) => {
    return await authService.sendPhoneOTP(phoneNumber);
  }, []);

  // Verify phone OTP
  const verifyPhoneOTP = useCallback(async (phoneNumber, otp) => {
    return await authService.verifyPhoneOTP(phoneNumber, otp);
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    verifyBookingOwnership,
    sendPhoneOTP,
    verifyPhoneOTP,
  };
}
