import { Link } from 'react-router-dom';
import { Building2, ArrowLeft } from 'lucide-react';

/**
 * NotFoundPage — 404 page with navigation back to home or dashboard.
 */
export default function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: 'var(--space-8)',
      backgroundColor: 'var(--bg-base)',
    }}>
      <div style={{
        width: 100,
        height: 100,
        borderRadius: 'var(--radius-3xl)',
        background: 'var(--color-primary-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--space-6)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <Building2 size={48} color="var(--color-primary-600)" />
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
        404
      </h1>
      <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-8)', maxWidth: 480 }}>
        The page or department you're looking for does not exist or may have been relocated.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
        <Link to="/" className="btn btn-secondary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          <ArrowLeft size={16} />
          <span>Hospital Home</span>
        </Link>
        <Link to="/dashboard" className="btn btn-primary btn-lg">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
