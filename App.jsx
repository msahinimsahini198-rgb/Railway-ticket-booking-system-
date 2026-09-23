import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [page, setPage] = useState(user ? "home" : "login");

  const logout = () => { localStorage.removeItem("user"); setUser(null); setPage("login"); };

  if (!user) return <Auth page={page} setPage={setPage} onLogin={u => { setUser(u); localStorage.setItem("user", JSON.stringify(u)); setPage("home"); }} />;

  return <div>
    <nav><b>🚆 Railway Booking</b><span>{user.name}</span>
      <button onClick={() => setPage("home")}>Home</button>
      <button onClick={() => setPage("bookings")}>My Bookings</button>
      <button onClick={logout}>Logout</button>
    </nav>
    {page === "home" ? <Home user={user} /> : <Bookings user={user} />}
  </div>;
}

function Auth({page,setPage,onLogin}) {
  const [form,setForm]=useState({name:"",email:"",mobile:"",password:""});
  const [msg,setMsg]=useState("");
  const submit=async e=>{
    e.preventDefault();
    const endpoint=page==="login"?"login":"register";
    const r=await fetch(`${API}/users/${endpoint}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    const d=await r.json(); setMsg(d.message);
    if(r.ok && page==="login") onLogin(d.user);
    if(r.ok && page==="register") setPage("login");
  };
  return <main className="card"><h1>🚆 Railway Ticket Booking</h1>
    <h2>{page==="login"?"Login":"Registration"}</h2>
    <form onSubmit={submit}>
      {page==="register" && <input placeholder="Name" required onChange={e=>setForm({...form,name:e.target.value})}/>}
      {page==="register" && <input placeholder="Mobile" onChange={e=>setForm({...form,mobile:e.target.value})}/>}
      <input type="email" placeholder="Email" required onChange={e=>setForm({...form,email:e.target.value})}/>
      <input type="password" placeholder="Password" required onChange={e=>setForm({...form,password:e.target.value})}/>
      <button>{page==="login"?"Login":"Register"}</button>
    </form><p>{msg}</p>
    <button className="link" onClick={()=>setPage(page==="login"?"register":"login")}>{page==="login"?"Create account":"Already registered? Login"}</button>
  </main>;
}

function Home({user}) {
  const [q,setQ]=useState({source:"",destination:""});
  const [trains,setTrains]=useState([]);
  const search=async()=>{const r=await fetch(`${API}/trains?source=${encodeURIComponent(q.source)}&destination=${encodeURIComponent(q.destination)}`);setTrains(await r.json())};
  useEffect(()=>{search()},[]);
  return <main><h1>Welcome, {user.name}</h1><div className="search">
    <input placeholder="From" value={q.source} onChange={e=>setQ({...q,source:e.target.value})}/>
    <input placeholder="To" value={q.destination} onChange={e=>setQ({...q,destination:e.target.value})}/>
    <button onClick={search}>Search Trains</button>
  </div>
  <div className="grid">{trains.map(t=><TrainCard key={t._id} train={t} user={user}/>)}</div>
  {trains.length===0 && <p>No trains found. Add sample trains through the API or MongoDB.</p>}</main>;
}

function TrainCard({train,user}) {
  const [done,setDone]=useState(false);
  const book=async()=>{
    const passenger={name:user.name,age:20,gender:"Not specified"};
    const r=await fetch(`${API}/bookings`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      userId:user.id,trainId:train._id,passengers:[passenger],journeyDate:new Date().toISOString().slice(0,10),
      classType:train.classes?.[0]||"SL",totalFare:train.fare
    })});
    const d=await r.json(); alert(r.ok?`Booking confirmed! PNR: ${d.pnr}`:d.message); if(r.ok)setDone(true);
  };
  return <div className="train"><h3>{train.trainName}</h3><p>{train.trainNumber}</p><p>{train.source} → {train.destination}</p><p>{train.departureTime} - {train.arrivalTime}</p><p>Seats: {train.availableSeats} | Fare: ₹{train.fare}</p><button disabled={done||!train.availableSeats} onClick={book}>{done?"Booked":"Book Ticket"}</button></div>;
}

function Bookings({user}) {
  const [items,setItems]=useState([]);
  const load=async()=>{const r=await fetch(`${API}/bookings/user/${user.id}`);setItems(await r.json())};
  useEffect(()=>{load()},[]);
  const cancel=async id=>{await fetch(`${API}/bookings/${id}/cancel`,{method:"PATCH"});load()};
  return <main><h1>My Bookings</h1>{items.map(b=><div className="booking" key={b._id}>
    <b>PNR: {b.pnr}</b><p>{b.trainId?.trainName} — {b.trainId?.source} → {b.trainId?.destination}</p>
    <p>Journey: {b.journeyDate} | Class: {b.classType} | Fare: ₹{b.totalFare}</p>
    <p>Status: <b>{b.status}</b></p>{b.status!=="Cancelled"&&<button onClick={()=>cancel(b._id)}>Cancel Ticket</button>}
  </div>)}</main>;
}
