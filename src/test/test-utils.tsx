import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';

function render(ui: ReactNode, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);

  return rtlRender(
    <>
      <AuthProvider>
        <BrowserRouter>
          {ui}
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render };
