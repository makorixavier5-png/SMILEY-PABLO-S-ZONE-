import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto'; // Install chart.js library for charts

const App = () => {
    const [journalEntries, setJournalEntries] = useState([]);
    const [entry, setEntry] = useState({ title: '', date: '', profitLoss: '' });

    useEffect(() => {
        const storedEntries = JSON.parse(localStorage.getItem('tradingJournal')) || [];
        setJournalEntries(storedEntries);
    }, []);

    useEffect(() => {
        localStorage.setItem('tradingJournal', JSON.stringify(journalEntries));
    }, [journalEntries]);

    const addEntry = () => {
        if (validateEntry(entry)) {
            setJournalEntries([...journalEntries, { ...entry, id: Date.now() }]);
            setEntry({ title: '', date: '', profitLoss: '' });
        }
    };

    const updateEntry = (id) => {
        const updatedEntries = journalEntries.map((e) => (e.id === id ? entry : e));
        setJournalEntries(updatedEntries);
    }; 

    const deleteEntry = (id) => {
        const filteredEntries = journalEntries.filter((e) => e.id !== id);
        setJournalEntries(filteredEntries);
    };

    const validateEntry = (entry) => {
        return entry.title && entry.date && entry.profitLoss; // Simplified validation
    };

    const exportEntries = () => {
        const csvContent = 'data:text/csv;charset=utf-8,' + journalEntries.map(e => `${e.title},${e.date},${e.profitLoss}`).join('\n');
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', 'trading_journal.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h1>Trading Journal</h1>
            <div>
                <input type="text" value={entry.title} onChange={(e) => setEntry({ ...entry, title: e.target.value })} placeholder="Title" />
                <input type="date" value={entry.date} onChange={(e) => setEntry({ ...entry, date: e.target.value })} />
                <input type="number" value={entry.profitLoss} onChange={(e) => setEntry({ ...entry, profitLoss: e.target.value })} placeholder="Profit/Loss" />
                <button onClick={addEntry}>Add Entry</button>
                <button onClick={exportEntries}>Export to CSV</button>
            </div>
            <ul>
                {journalEntries.map((e) => (
                    <li key={e.id}>
                        {e.title} - {e.date} - {e.profitLoss}
                        <button onClick={() => deleteEntry(e.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <canvas id="myChart" />
            {/* Add chart rendering logic here */}
        </div>
    );
};

export default App;