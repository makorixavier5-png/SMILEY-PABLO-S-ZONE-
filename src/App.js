import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function App() {
    const [trades, setTrades] = useState([
        { pair: "EUR/USD", result: "win", session: "London", entryPrice: 1.1, stopLoss: 1.08, takeProfit: 1.12, rr: 2, date: "2026-03-25" },
        { pair: "GBP/USD", result: "loss", session: "New York", entryPrice: 1.25, stopLoss: 1.27, takeProfit: 1.3, rr: 0.5, date: "2026-03-24" }
    ]);

    const [pair, setPair] = useState("");
    const [result, setResult] = useState("win");
    const [session, setSession] = useState("London");
    const [entryPrice, setEntryPrice] = useState("");
    const [stopLoss, setStopLoss] = useState("");
    const [takeProfit, setTakeProfit] = useState("");
    const [analysis, setAnalysis] = useState("");
    const [nav, setNav] = useState("dashboard");
    const [newsData, setNewsData] = useState([
        { time: "10:00", pair: "EUR/USD", event: "CPI Release", importance: "High", forecast: "1.2%", actual: "1.3%" },
        { time: "12:00", pair: "GBP/USD", event: "Interest Rate", importance: "Medium", forecast: "0.75%", actual: "0.75%" }
    ]);

    const addTrade = () => {
        if (!pair || !entryPrice || !stopLoss || !takeProfit) return;
        const rr = ((takeProfit - entryPrice) / (entryPrice - stopLoss)).toFixed(2);
        const newTrade = { pair, result, session, entryPrice: parseFloat(entryPrice), stopLoss: parseFloat(stopLoss), takeProfit: parseFloat(takeProfit), rr, date: new Date().toLocaleDateString() };
        setTrades([...trades, newTrade]);
        setPair("");
        setEntryPrice("");
        setStopLoss("");
        setTakeProfit("");
    };

    useEffect(() => {
        const wins = trades.filter(t => t.result === "win").length;
        const losses = trades.filter(t => t.result === "loss").length;
        if (wins > losses) {
            setAnalysis("Market conditions favor your strategy. Focus on high probability setups today.");        
        } else {
            setAnalysis("Be cautious today. Market conditions are not optimal for your strategy.");
        }
    }, [trades]);

    const totalTrades = trades.length;
    const wins = trades.filter(t => t.result === "win").length;
    const losses = trades.filter(t => t.result === "loss").length;
    const winRate = totalTrades ? ((wins / totalTrades) * 100).toFixed(1) : 0;
    const lossRate = totalTrades ? ((losses / totalTrades) * 100).toFixed(1) : 0;

    const pairStats = trades.reduce((acc, t) => {
        if (!acc[t.pair]) acc[t.pair] = { wins: 0, losses: 0 };
        t.result === "win" ? acc[t.pair].wins++ : acc[t.pair].losses++;
        return acc;
    }, {});

    const sessionStats = trades.reduce((acc, t) => {
        if (!acc[t.session]) acc[t.session] = { wins: 0, losses: 0 };
        t.result === "win" ? acc[t.session].wins++ : acc[t.session].losses++;
        return acc;
    }, {});

    const chartData = {
        labels: Object.keys(pairStats),
        datasets: [
            { label: "Wins", data: Object.keys(pairStats).map(p => pairStats[p].wins), backgroundColor: "green" },
            { label: "Losses", data: Object.keys(pairStats).map(p => pairStats[p].losses), backgroundColor: "red" }
        ]
    };
    
    const Navigation = () => ( 
        <div className="flex mb-4 space-x-4"> 
            { ["dashboard", "add", "history", "report", "news"].map(tab => ( 
                <button key={tab} onClick={() => setNav(tab)} className={
                    `p-2 rounded ${nav===tab ? "bg-blue-500 text-white" : "bg-gray-300"}` 
                }> 
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} 
                </button>
            ))}
        </div>
    );

    return (
        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold mb-4">SMILEY PABLO'S ZONE</h1>
            <Navigation />
            {nav === "dashboard" && (
                <div>
                    <h2 className="text-xl mb-2">Dashboard</h2>
                    <p>Total Trades: {totalTrades}</p>
                    <p>Win %: {winRate}%</p>
                    <p>Loss %: {lossRate}%</p>
                    <p className="mt-2 font-semibold">{analysis}</p>
                    <h3 className="mt-4 font-bold">Best Pairs:</h3>
                    {Object.keys(pairStats).length === 0
                        ? <p>No data</p>
                        : Object.keys(pairStats).map(p => <p key={p}>{p} - Wins: {pairStats[p].wins}, Losses: {pairStats[p].losses}</p>)}
                    <h3 className="mt-4 font-bold">Session Stats:</h3>
                    {Object.keys(sessionStats).length === 0
                        ? <p>No data</p>
                        : Object.keys(sessionStats).map(s => <p key={s}>{s} - Wins: {sessionStats[s].wins}, Losses: {sessionStats[s].losses}</p>)}
                    <div className="mt-6">
                        <h3 className="text-lg font-bold mb-2">Win/Loss per Pair Chart</h3>
                        <Bar data={chartData} />
                    </div>
                </div>
            )}
            {nav === "add" && (
                <div>
                    <h2 className="text-xl mb-2">Add Trade</h2>
                    <input className="border p-2 mr-2 mb-2" placeholder="Pair" value={pair} onChange={e => setPair(e.target.value)} />
                    <select className="border p-2 mr-2 mb-2" value={result} onChange={e => setResult(e.target.value)}>
                        <option value="win">Win</option>
                        <option value="loss">Loss</option>
                    </select>
                    <select className="border p-2 mr-2 mb-2" value={session} onChange={e => setSession(e.target.value)}>
                        <option value="London">London</option>
                        <option value="New York">New York</option>
                        <option value="Tokyo">Tokyo</option>
                    </select>
                    <input className="border p-2 mr-2 mb-2" placeholder="Entry Price" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} />
                    <input className="border p-2 mr-2 mb-2" placeholder="Stop Loss" value={stopLoss} onChange={e => setStopLoss(e.target.value)} />
                    <input className="border p-2 mr-2 mb-2" placeholder="Take Profit" value={takeProfit} onChange={e => setTakeProfit(e.target.value)} />
                    <button className="bg-blue-500 text-white p-2 rounded" onClick={addTrade}>Add Trade</button>
                </div>
            )}
            {nav === "history" && (
                <div>
                    <h2 className="text-xl mb-2">Trade History</h2>
                    {trades.map((t, i) => 
                        <div key={i} className="border p-2 mb-2 rounded">
                            <p>{t.date} - {t.pair} - {t.result} - {t.session} - R:R {t.rr}</p>
                        </div>
                    )}
                </div>
            )}
            {nav === "news" && (
                <div>
                    <h2 className="text-xl mb-2">News & Fundamental Analysis</h2>
                    {newsData.map((n, i) => 
                        <div key={i} className="border p-2 mb-2 rounded">
                            <p><strong>{n.time}</strong> - {n.pair} - {n.event} ({n.importance})</p>
                            <p>{n.forecast ? `Forecast: ${n.forecast}` : ''}</p>
                            <p>{n.actual ? `Actual: ${n.actual}` : ''}</p>
                        </div>
                    )}
                </div>
            )}
            {nav === "report" && (
                <div>
                    <h2 className="text-xl mb-2">Weekly Report</h2>
                    <p>Total Trades: {totalTrades}</p>
                    <p>Wins: {wins}, Losses: {losses}</p>
                    <p>Win Rate: {winRate}%, Loss Rate: {lossRate}%</p>
                    <h3 className="mt-2">Best Performing Pair: {Object.keys(pairStats).reduce((a,b) => pairStats[a].wins > pairStats[b].wins ? a : b, Object.keys(pairStats)[0] || "N/A")}</h3>
                </div>
            )}
        </div>
    );
}