import React, { useState, useEffect } from 'react';
import API from '../api';

function AdminPanel({ token }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    API.get('/polls').then(res => setPolls(res.data));
  }, []);

  const createPoll = async () => {
    try {
      await API.post('/polls', { question, options }, {
        headers: { Authorization: token }
      });
      alert('Poll created');
      setQuestion('');
      setOptions(['', '']);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div>
      <h3>Create New Poll</h3>
      <input placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} /><br />
      {options.map((opt, i) => (
        <><input
              key={i}
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => {
                  const newOpts = [...options];
                  newOpts[i] = e.target.value;
                  setOptions(newOpts);
              } } /><br /></>
      ))}
      <button onClick={() => setOptions([...options, ''])}>Add Option</button><br />
      <button onClick={createPoll}>Create Poll</button>

      <h3>All Polls</h3>
      {polls.map((poll) => (
        <div key={poll._id} className="poll-card" >
          <b>{poll.question}</b>
          <ul>
            {poll.options.map((opt, i) => (
              <li key={i}>{opt.text} - Votes: {opt.votes}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default AdminPanel;
