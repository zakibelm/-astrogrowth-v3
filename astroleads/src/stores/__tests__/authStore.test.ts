import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../authStore';

describe('authStore', () => {
    beforeEach(() => {
        // Reset store state before each test
        useAuthStore.setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
    });

    it('should have initial state', () => {
        const { result } = renderHook(() => useAuthStore());

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.isLoading).toBe(false);
    });

    it('should login successfully with valid demo credentials', async () => {
        const { result } = renderHook(() => useAuthStore());

        let success: boolean;
        await act(async () => {
            success = await result.current.login('admin@astroleads.com', 'password');
        });

        expect(success!).toBe(true);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user).not.toBeNull();
        expect(result.current.user?.email).toBe('admin@astroleads.com');
    });

    it('should fail login with invalid credentials', async () => {
        const { result } = renderHook(() => useAuthStore());

        let success: boolean;
        await act(async () => {
            success = await result.current.login('invalid@email.com', 'password');
        });

        expect(success!).toBe(false);
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
    });

    it('should logout correctly', async () => {
        const { result } = renderHook(() => useAuthStore());

        // First login
        await act(async () => {
            await result.current.login('admin@astroleads.com', 'password');
        });

        expect(result.current.isAuthenticated).toBe(true);

        // Then logout
        act(() => {
            result.current.logout();
        });

        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
    });


});
