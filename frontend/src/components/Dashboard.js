import React, { useEffect, useState } from 'react';
import API from '../api';

function Dashboard({ token }) {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    API.get('/polls').then(res => setPolls(res.data));
  }, []);

  const vote = async (pollId, optionIndex) => {
    try {
      await API.post('/vote', { pollId, optionIndex }, {
        headers: { Authorization: token }
      });
      alert('Voted!');
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div>
      <h3>Available Polls</h3>
      {polls.map((poll) => (
        <div key={poll._id} className="poll-card">
            <strong>{poll.question}</strong>
            <ul>
                {poll.options.map((opt, i) => (
                <li key={i}>
                    {opt.text} - Votes: {opt.votes}
                    <button onClick={() => vote(poll._id, i)}>Vote</button>
                </li>
                ))}
            </ul>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
