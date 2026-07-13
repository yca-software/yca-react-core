import * as React from 'react';

const InsideModalScrollLockContext = React.createContext(false);

export function InsideModalScrollLockProvider({
  children,
  active = true,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <InsideModalScrollLockContext.Provider value={active}>
      {children}
    </InsideModalScrollLockContext.Provider>
  );
}

export function useInsideModalScrollLock(): boolean {
  return React.useContext(InsideModalScrollLockContext);
}
