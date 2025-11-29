import Navigation from "../component/Navigation";

const Expense = () => {
  return (
    <div className="grid h-screen place-content-start">
        <main className="flex flex-col w-screen">
          <div className="grid grid-cols-2 bg-black border-b ">
            <button className="font-bold p-4 border-r border-white/50">Monthly</button>
            <button className="font-bold p-4">Daily</button>
          </div>
          <div className="px-2 py-6">
                <h2 className="text-2xl font-bold mb-4">Expense</h2>
            </div>
        </main>
        <Navigation />
    </div>
  );
}
export default Expense;