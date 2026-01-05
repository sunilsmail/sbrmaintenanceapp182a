import { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const FLATS = 17;
const MAINTENANCE_PER_FLAT = 2000;

interface Payment {
  flatNo: number;
  amount: number;
  date: string;
}

interface Expense {
  amount: number;
  note: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseAmount, setExpenseAmount] = useState<string>("");
  const [expenseNote, setExpenseNote] = useState<string>("");

  const totalExpected = FLATS * MAINTENANCE_PER_FLAT;
  const totalCollected = payments.reduce((s, p) => s + p.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const balance = totalCollected - totalExpenses;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const paySnap = await getDocs(collection(db, "payments"));
    setPayments(paySnap.docs.map(d => d.data() as Payment));

    const expSnap = await getDocs(collection(db, "expenses"));
    setExpenses(expSnap.docs.map(d => d.data() as Expense));
  };

  const addPayment = async (flatNo: number) => {
    await addDoc(collection(db, "payments"), {
      flatNo,
      amount: MAINTENANCE_PER_FLAT,
      date: new Date().toLocaleDateString("en-IN"),
    });
    loadData();
  };

  const addExpense = async () => {
    if (!expenseAmount) return;

    await addDoc(collection(db, "expenses"), {
      amount: Number(expenseAmount),
      note: expenseNote,
      date: new Date().toLocaleDateString("en-IN"),
    });

    setExpenseAmount("");
    setExpenseNote("");
    loadData();
  };

  return (
    <div>
      <h3>📊 Monthly Summary</h3>
      <p>Total Flats: {FLATS}</p>
      <p>Total Expected: ₹{totalExpected}</p>
      <p>Collected: ₹{totalCollected}</p>
      <p>Expenses: ₹{totalExpenses}</p>
      <h3>💰 Balance: ₹{balance}</h3>

      <h3>🏠 Flat-wise Collection</h3>
      {[...Array(FLATS)].map((_, i) => (
        <button
          key={i}
          onClick={() => addPayment(i + 1)}
          style={{ margin: 4 }}
        >
          Mark Flat {i + 1} Paid
        </button>
      ))}

      <h3>🧾 Add Expense</h3>
      <input
        placeholder="Amount"
        value={expenseAmount}
        onChange={e => setExpenseAmount(e.target.value)}
      />
      <input
        placeholder="Note"
        value={expenseNote}
        onChange={e => setExpenseNote(e.target.value)}
      />
      <button onClick={addExpense}>Add Expense</button>

      <h3>📉 Expense History</h3>
      <ul>
        {expenses.map((e, i) => (
          <li key={i}>
            {e.date} – ₹{e.amount} ({e.note})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;