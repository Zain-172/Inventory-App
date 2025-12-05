

export default function TopBar({ children }) {

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-2 bg-white dark:bg-black border-b dark:border-white   ">
      {children}
    </header>
  );
}
