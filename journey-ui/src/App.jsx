import './App.css';
import axios from "axios"

function App() {
  const PORT = 3001
  const response = () => {
    axios.post(`http://localhost:${PORT}/users/register`, {
    email : document.getElementById('email').value,
    username : document.getElementById('username').value,
    password : document.getElementById('password').value,
})

.then(function(response) {
    console.log(response)
})

.catch(function(error) {
    console.log(error)
})
}
  return (
    <div className = "Login">
      <input id="email" placeholder="Email..." input="text"/>
      <input id="username" placeholder="Username..." input="text"/>
      <input id="password" placeholder="Password..." input="text"/>
      <button onClick={response}>Register</button>
    </div>
  );
}

export default App;
