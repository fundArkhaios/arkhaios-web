export default function DisplayProfile({ user }) {
  const payload = {
    balance: "511.91",
    purchasing_power: "231.31",
    transactions_made: "123",
  };

  return (
    <div className = "py-10 px-10 space-y-5">
      <div className="justify-start">
        <div className="justify-start">Balance</div>
        <p className="text-5xl">{payload.balance}</p>
      </div>
      <div className = "justify-self-start">
        <p>Purchasing Power</p>
        <p className="text-5xl">{payload.purchasing_power}</p>
      </div>
      <div className = "justify-self-start">
        <p>Transactions Made</p>
        <p className="text-5xl">{payload.transactions_made}</p>
      </div>
    </div>
  );
}
