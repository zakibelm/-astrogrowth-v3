import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
    it('should render children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('should handle click events', () => {
        let clicked = false;
        render(<Button onClick={() => (clicked = true)}>Click me</Button>);

        fireEvent.click(screen.getByRole('button'));
        expect(clicked).toBe(true);
    });

    it('should be disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should be disabled when isLoading is true', () => {
        render(<Button isLoading>Loading</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should show spinner when loading', () => {
        render(<Button isLoading>Loading</Button>);
        expect(screen.getByRole('button').querySelector('svg.animate-spin')).toBeInTheDocument();
    });

    it('should render with different variants', () => {
        const { rerender } = render(<Button variant="primary">Primary</Button>);
        expect(screen.getByRole('button')).toHaveClass('neon-button');

        rerender(<Button variant="secondary">Secondary</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-astro-800');

        rerender(<Button variant="danger">Danger</Button>);
        expect(screen.getByRole('button')).toHaveClass('text-red-400');
    });

    it('should render with different sizes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        expect(screen.getByRole('button')).toHaveClass('px-3');

        rerender(<Button size="md">Medium</Button>);
        expect(screen.getByRole('button')).toHaveClass('px-4');

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByRole('button')).toHaveClass('px-6');
    });

    it('should render left icon', () => {
        render(<Button leftIcon={<span data-testid="icon">★</span>}>With Icon</Button>);
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should render right icon', () => {
        render(<Button rightIcon={<span data-testid="icon">→</span>}>With Icon</Button>);
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should pass additional className', () => {
        render(<Button className="custom-class">Custom</Button>);
        expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
});
