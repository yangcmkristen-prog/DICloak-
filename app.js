const state = {
  prompt: "浣犳槸DICloak瀹㈡湇鍔╂墜锛岃鍩轰簬鐭ヨ瘑搴撶敓鎴?鏉″彲鐩存帴鍙戦€佺殑鍥炲銆?,
  sessions: [{id: Date.now().toString(), name:"榛樿瀵硅瘽", messages:[]}],
  active: null,
  kb: { faq:0, feature:0, term:0 }
};
state.active = state.sessions[0].id;

const $ = (id)=>document.getElementById(id);
const chatList = $("chatList"), history = $("history"), replies = $("replies");

$("prompt").value = state.prompt;

function activeSession(){ return state.sessions.find(s=>s.id===state.active); }

function renderChats(){
  chatList.innerHTML = "";
  state.sessions.forEach(s=>{
    const li = document.createElement("li");
    li.style.cursor="pointer";
    li.textContent = (s.id===state.active?"馃憠 ":"") + s.name;
    li.onclick = ()=>{ state.active=s.id; renderChats(); renderHistory(); };
    chatList.appendChild(li);
  });
}

function renderHistory(){
  history.innerHTML = "";
  activeSession().messages.forEach(m=>{
    const d = document.createElement("div");
    d.className = "msg " + m.role;
    d.textContent = m.content;
    history.appendChild(d);
  });
}

function toast(t){
  const el = $("toast"); el.textContent=t; el.style.display="block";
  setTimeout(()=>el.style.display="none",1200);
}

$("newChat").onclick = ()=>{
  const name = prompt("瀵硅瘽鍚?,"鏂板璇?);
  if(!name) return;
  const s = {id: (Date.now()+Math.random()).toString(), name, messages:[]};
  state.sessions.unshift(s); state.active=s.id;
  renderChats(); renderHistory();
};

function loadExcel(input, key){
  input.onchange = async (e)=>{
    const f = e.target.files[0]; if(!f) return;
    const ab = await f.arrayBuffer();
    const wb = XLSX.read(ab, {type:"array"});
    let count = 0;
    wb.SheetNames.forEach(n=>{
      const json = XLSX.utils.sheet_to_json(wb.Sheets[n], {defval:""});
      count += json.length;
    });
    state.kb[key] = count;
    $("kbInfo").textContent = `FAQ:${state.kb.faq} 琛? 鍔熻兘:${state.kb.feature} 琛? 鏈:${state.kb.term} 琛宍;
  };
}
loadExcel($("faq"),"faq");
loadExcel($("feature"),"feature");
loadExcel($("term"),"term");

$("gen").onclick = ()=>{
  const q = $("question").value.trim();
  if(!q) return alert("璇疯緭鍏ラ棶棰?);
  activeSession().messages.push({role:"user", content:q});

  const base = `鍩轰簬褰撳墠Prompt涓庣煡璇嗗簱锛團AQ:${state.kb.faq}锛屽姛鑳?${state.kb.feature}锛屾湳璇?${state.kb.term}锛塦;
  const arr = [
    `鎮ㄥソ锛屽叧浜庘€?{q}鈥濓紝${base}锛屽缓璁偍鍏堟寜椤甸潰寮曞杩涜鎺掓煡锛屾垜鍙互缁х画鍗忓姪鎮ㄩ€愭纭銆俙,
    `鏀跺埌锛岄拡瀵光€?{q}鈥濓紝${base}锛屽彲鍏堟鏌ュ叆鍙ｈ矾寰勫拰瑙掕壊鏉冮檺鍚庡啀閲嶈瘯銆俙,
    `鎰熻阿鍙嶉锛岄拡瀵光€?{q}鈥濓紝${base}锛岃嫢浠嶅紓甯歌鎻愪緵鎴浘涓庤处鍙疯鑹诧紙client/end_user锛夈€俙
  ];

  activeSession().messages.push({role:"bot", content:"宸茬敓鎴?鏉℃帹鑽愬洖澶?});
  renderHistory();

  replies.innerHTML="";
  arr.forEach((t,i)=>{
    const d = document.createElement("div");
    d.className="reply"; d.textContent = `${i+1}. ${t}`;
    d.onclick = async ()=>{ await navigator.clipboard.writeText(t); toast("宸插鍒?); };
    replies.appendChild(d);
  });
};

renderChats();
renderHistory();
