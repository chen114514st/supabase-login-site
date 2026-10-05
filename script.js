import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://cqfluzimkehqpuzotzxi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_MZGz2BvFNpvcZm1UQ45qBg_Ka7OatOk";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const authView = document.querySelector("#authView");
const userView = document.querySelector("#userView");
const authForm = document.querySelector("#authForm");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const submitBtn = document.querySelector("#submitBtn");
const toggleBtn = document.querySelector("#toggleBtn");
const message = document.querySelector("#message");
const userEmail = document.querySelector("#userEmail");
const logoutBtn = document.querySelector("#logoutBtn");

let isSignUp = false;

function showMessage(text) {
  message.textContent = text;
}

function showUser(user) {
  authView.hidden = true;
  userView.hidden = false;
  userEmail.textContent = user.email ?? "";
}

function showAuth() {
  authView.hidden = false;
  userView.hidden = true;
}

toggleBtn.addEventListener("click", () => {
  isSignUp = !isSignUp;
  submitBtn.textContent = isSignUp ? "注册" : "登录";
  toggleBtn.textContent = isSignUp ? "已有账号？登录" : "还没有账号？注册";
  showMessage("");
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitBtn.disabled = true;
  showMessage("处理中…");

  const e = email.value.trim();
  const p = password.value;

  try {
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email: e,
        password: p
      });
      if (error) throw error;

      if (data.session) {
        showUser(data.user);
      } else {
        showMessage("注册成功！请检查邮箱完成验证，然后再登录。");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: e,
        password: p
      });
      if (error) throw error;
      showUser(data.user);
    }
  } catch (error) {
    showMessage(error.message || "操作失败");
  } finally {
    submitBtn.disabled = false;
  }
});

logoutBtn.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert(error.message);
    return;
  }
  showAuth();
  authForm.reset();
  showMessage("已退出登录");
});

supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) showUser(session.user);
  else showAuth();
});

const { data: { session } } = await supabase.auth.getSession();
if (session?.user) showUser(session.user);
