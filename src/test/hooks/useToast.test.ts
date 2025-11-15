import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useToast } from '../../hooks/useToast';

describe('useToast', () => {
  beforeEach(() => {
    // Reset toast counter - each test gets a fresh hook instance
  });

  it('initializes with empty toasts', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it('shows a toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Test message');
    expect(result.current.toasts[0].type).toBe('info');
  });

  it('shows toast with custom type', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Success message', 'success');
    });

    expect(result.current.toasts[0].type).toBe('success');
  });

  it('shows toast with duration', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Message', 'info', 5000);
    });

    expect(result.current.toasts[0].duration).toBe(5000);
  });

  it('closes a toast', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string;
    act(() => {
      toastId = result.current.showToast('Test message');
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.closeToast(toastId!);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('shows success toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Success!');
    });

    expect(result.current.toasts[0].type).toBe('success');
    expect(result.current.toasts[0].message).toBe('Success!');
  });

  it('shows error toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.error('Error!');
    });

    expect(result.current.toasts[0].type).toBe('error');
    expect(result.current.toasts[0].message).toBe('Error!');
  });

  it('shows info toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.info('Info!');
    });

    expect(result.current.toasts[0].type).toBe('info');
    expect(result.current.toasts[0].message).toBe('Info!');
  });

  it('shows warning toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.warning('Warning!');
    });

    expect(result.current.toasts[0].type).toBe('warning');
    expect(result.current.toasts[0].message).toBe('Warning!');
  });

  it('generates unique toast IDs', () => {
    const { result } = renderHook(() => useToast());

    let id1: string;
    let id2: string;

    act(() => {
      id1 = result.current.showToast('First');
      id2 = result.current.showToast('Second');
    });

    expect(id1!).not.toBe(id2!);
    expect(result.current.toasts).toHaveLength(2);
  });
});

