
const API_URL = "http://localhost:3000/comments"; 
const AVATAR_API = "https://api.dicebear.com/7.x/notionists/svg?seed=";


const API = {
    async fetchComments() {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Error al obtener comentarios");
            return await res.json();
        } catch (err) {
            console.error("Error API GET:", err);
            return [];
        }
    },

    async postComment(comment) {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(comment)
            });
            return res.ok;
        } catch (err) {
            console.error("Error API POST:", err);
            return false;
        }
    },

    async deleteComment(id) {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            return res.ok;
        } catch (err) {
            console.error("Error API DELETE:", err);
            return false;
        }
    }
};


const UI = {
    container: document.getElementById('comments-container'),
    userInput: document.getElementById('username'),
    messageInput: document.getElementById('message'),
    errorMsg: document.getElementById('error-msg'),

    render(allComments) {
        if (!this.container) return;
        this.container.innerHTML = "";
        
        const mainComments = allComments.filter(c => !c.parentId);
        const replies = allComments.filter(c => c.parentId);

        if (mainComments.length === 0) {
            this.container.innerHTML = `<p style="text-align:center; padding:20px; color:var(--text-muted);">No hay comentarios aún. ¡Sé el primero!</p>`;
            return;
        }

        mainComments.sort((a, b) => new Date(b.date) - new Date(a.date));

        mainComments.forEach(c => {
            const currentReplies = replies.filter(r => r.parentId === c.id);
            const card = document.createElement('div');
            card.className = 'comment-card';
            
            card.innerHTML = `
                <div class="comment-header" style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                    <img src="${AVATAR_API + c.username}" class="avatar-md" style="width:48px; height:48px; border-radius:50%; border:2px solid var(--primary);">
                    <strong class="username" style="color:var(--primary);">@${c.username}</strong>
                    <span class="date" style="margin-left:auto; font-size:0.75rem; color:var(--text-muted);">${this.formatRelativeTime(c.date)}</span>
                </div>
                <p class="comment-text" style="margin-bottom:1rem;">${this.escapeHTML(c.message)}</p>
                <div class="card-footer" style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:10px;">
                    <button class="btn-reply" style="background:none; border:none; color:var(--primary); font-weight:700; cursor:pointer;" onclick="window.toggleReplyBox('${c.id}')">
                        <i class="fa-solid fa-reply"></i> Responder (${currentReplies.length})
                    </button>
                    <button class="btn-delete" style="background:none; border:none; color:var(--text-muted); cursor:pointer;" onclick="window.handleDelete('${c.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>

                <div class="replies-container" style="margin-left:2rem; border-left:2px solid var(--border); padding-left:1rem; margin-top:1rem;">
                    ${currentReplies.map(r => `
                        <div class="reply-item" style="background:var(--reply-bg); padding:8px; border-radius:8px; margin-bottom:5px;">
                            <strong style="font-size:0.8rem; color:var(--primary);">@${r.username}</strong>
                            <p style="font-size:0.9rem;">${this.escapeHTML(r.message)}</p>
                        </div>
                    `).join('')}
                </div>

                <div id="reply-box-${c.id}" class="reply-form" style="display:none; margin-top:10px;">
                    <textarea id="reply-input-${c.id}" style="width:100%; border-radius:8px; padding:8px; border:1px solid var(--border);" placeholder="Escribe tu respuesta..." rows="2"></textarea>
                    <button class="btn-main" style="margin-top:5px; padding:6px; font-size:0.8rem; width:100%; background:var(--primary); color:white; border:none; border-radius:8px;" onclick="window.sendReply('${c.id}')">Enviar</button>
                </div>
            `;
            this.container.appendChild(card);
        });
    },

    formatRelativeTime(dateStr) {
        const now = new Date();
        const past = new Date(dateStr);
        const diffInMs = now - past;
        const diffInMins = Math.floor(diffInMs / 60000);
        if (diffInMins < 1) return "Ahora";
        if (diffInMins < 60) return `Hace ${diffInMins} min`;
        if (diffInMins < 1440) return `Hace ${Math.floor(diffInMins / 60)} h`;
        return past.toLocaleDateString();
    },

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};



async function loadComments() {
    const data = await API.fetchComments();
    UI.render(data);
}

// Publicar Principal

document.getElementById('btnPublish').onclick = async () => {
    console.log("Intentando publicar..."); // Debug para saber si entra a la función

    const msgInput = document.getElementById('message');
    const message = msgInput.value.trim();
    const username = localStorage.getItem('wall_user'); // Sacamos el usuario de la sesión

    // 1. Validaciones
    if (!username) {
        alert("Error: No hay usuario activo. Por favor inicia sesión.");
        return;
    }

    if (message.length < 5) {
        alert("El mensaje es muy corto (mínimo 5 caracteres)");
        return;
    }


    const nuevoComentario = {
        username: username,
        message: message,
        date: new Date().toISOString(),
        parentId: null 
    };

    console.log("Enviando a la API:", nuevoComentario);


    const success = await API.postComment(nuevoComentario);

    if (success) {
        console.log("¡Publicado con éxito!");
        msgInput.value = ""; // Limpiar el cuadro de texto
        

        const btnToggle = document.getElementById('btnToggleForm');
        if (btnToggle) btnToggle.click(); 


        await loadAndRender(); 
    } else {
        alert("Error al conectar con la base de datos. ¿Está prendido el json-server?");
    }
};

// Respuestas
window.toggleReplyBox = (id) => {
    const box = document.getElementById(`reply-box-${id}`);
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
};

window.sendReply = async (parentId) => {
    const input = document.getElementById(`reply-input-${parentId}`);
    const message = input.value.trim();
    const username = localStorage.getItem('wall_user');

    if (message.length < 2) return alert("Respuesta muy corta");

    const reply = { username, message, date: new Date().toISOString(), parentId };

    if (await API.postComment(reply)) {
        await loadComments();
    }
};

// Eliminar
window.handleDelete = async (id) => {
    if (confirm("¿Eliminar comentario?")) {
        if (await API.deleteComment(id)) await loadComments();
    }
};


const Session = {
    init() {
      
        if(localStorage.getItem('dark_mode') === 'true') document.body.classList.add('dark-mode');
        const btnDark = document.getElementById('btnDarkMode');
        if(btnDark) {
            btnDark.onclick = () => {
                const isDark = document.body.classList.toggle('dark-mode');
                localStorage.setItem('dark_mode', isDark);
                const icon = document.getElementById('dark-icon');
                if(icon) icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            };
        }

        const btnLogin = document.getElementById('btnLogin');
        const loginUser = document.getElementById('login-username');
        if(btnLogin) {
            btnLogin.onclick = () => {
                const user = loginUser.value.trim();
                if (user.length >= 3) {
                    localStorage.setItem('wall_user', user);
                    this.activeSession(user);
                } else {
                    alert("Usuario muy corto (mín. 3 letras)");
                }
            };
        }

        // 3. Toggle Formulario (Abrir/Cerrar)
        const btnToggle = document.getElementById('btnToggleForm');
        const formSection = document.getElementById('comment-form-section');
        if(btnToggle && formSection) {
            btnToggle.onclick = () => {
                const isHidden = formSection.style.display === 'none';
                formSection.style.display = isHidden ? 'block' : 'none';
                btnToggle.innerHTML = isHidden ? '<i class="fa-solid fa-xmark"></i> Cancelar' : '<i class="fa-solid fa-plus"></i> Nuevo Comentario';
            };
        }

        // Auto-login check al cargar página
        const savedUser = localStorage.getItem('wall_user');
        if (savedUser) this.activeSession(savedUser);
    },

    activeSession(user) {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-app').style.display = 'flex';
        if(UI.userInput) UI.userInput.value = user;
        const avatarImg = document.getElementById('user-avatar');
        if(avatarImg) avatarImg.src = AVATAR_API + user;
        loadComments();
    },

    logout() {
        if (confirm("¿Seguro que quieres salir?")) {
            localStorage.removeItem('wall_user');
            window.location.reload();
        }
    }
};


window.Session = Session;
Session.init();