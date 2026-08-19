const fs = require('fs');
let code = fs.readFileSync('src/screens/LeaderboardScreen.tsx', 'utf8');

const target1 = `  const [addingFriend, setAddingFriend] = useState(false);`;
const replace1 = `  const [addingFriend, setAddingFriend] = useState(false);\n  const [msg, setMsg] = useState({ text: "", type: "" });`;

const target2 = `    if (success) {
      setFriendId("");
      alert("Friend added successfully!");
    } else {
      alert("Could not add friend. Check the ID and try again.");
    }`;

const replace2 = `    if (success) {
      setFriendId("");
      setMsg({ text: "Friend added successfully!", type: "success" });
    } else {
      setMsg({ text: "Could not add friend. Check the ID and try again.", type: "error" });
    }
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);`;

const target3 = `      {activeTab === 'friends' && (
        <form onSubmit={handleAddFriend} className="mb-6 flex gap-2">`;

const replace3 = `      {msg.text && (
        <div className={\`mb-4 p-3 rounded-xl text-sm font-semibold \${msg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}\`}>
          {msg.text}
        </div>
      )}
      {activeTab === 'friends' && (
        <form onSubmit={handleAddFriend} className="mb-6 flex gap-2">`;

code = code.replace(target1, replace1).replace(target2, replace2).replace(target3, replace3);
fs.writeFileSync('src/screens/LeaderboardScreen.tsx', code);
console.log('Patched leaderboard!');
