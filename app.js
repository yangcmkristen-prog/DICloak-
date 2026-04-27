const state = {
  prompt: "你是DICloak客服助手，请基于知识库生成3条可直接发送的回复。",
  sessions: [{id: Date.now().toString(), name:"默认对话", messages:[]}],
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
    li.textContent = (s.id===state.active?"👉 ":"") + s.name;
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
  const name = prompt("对话名","新对话");
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
    $("kbInfo").textContent = `FAQ:${state.kb.faq} 行, 功能:${state.kb.feature} 行, 术语:${state.kb.term} 行`;
  };
}
loadExcel($("faq"),"faq");
loadExcel($("feature"),"feature");
loadExcel($("term"),"term");

$("gen").onclick = ()=>{
  const q = $("question").value.trim();
  if(!q) return alert("请输入问题");
  activeSession().messages.push({role:"user", content:q});

  const base = `基于当前Prompt与知识库（FAQ:${state.kb.faq}，功能:${state.kb.feature}，术语:${state.kb.term}）`;
  const arr = [
    `您好，关于“${q}”，${base}，建议您先按页面引导进行排查，我可以继续协助您逐步确认。`,
    `收到，针对“${q}”，${base}，可先检查入口路径和角色权限后再重试。`,
    `感谢反馈，针对“${q}”，${base}，若仍异常请提供截图与账号角色（client/end_user）。`
  ];

  activeSession().messages.push({role:"bot", content:"已生成3条推荐回复"});
  renderHistory();

  replies.innerHTML="";
  arr.forEach((t,i)=>{
    const d = document.createElement("div");
    d.className="reply"; d.textContent = `${i+1}. ${t}`;
    d.onclick = async ()=>{ await navigator.clipboard.writeText(t); toast("已复制"); };
    replies.appendChild(d);
  });
};

renderChats();
renderHistory();
