const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const imageUpload = document.getElementById('imageUpload');

let currentMode = null;

function addMessage(text, isUser) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message');
  msgDiv.classList.add(isUser ? 'user-message' : 'bot-message');
  msgDiv.textContent = text;
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addImageToChat(src, isUser) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message');
  msgDiv.classList.add(isUser ? 'user-message' : 'bot-message');
  const img = document.createElement('img');
  img.src = src;
  img.classList.add('preview-img');
  msgDiv.appendChild(img);
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showMainMenu() {
  const menuHTML = `
    <div class="menu-grid">
      <div class="menu-btn" onclick="startSticker()">Buat Sticker</div>
      <div class="menu-btn" onclick="startSmeme()">Buat Smeme</div>
      <div class="menu-btn" onclick="startBrat()">Buat Brat</div>
      <div class="menu-btn" onclick="generateQR()">QR Code Generator</div>
      <div class="menu-btn" onclick="startImageFilter()">Image Filter</div>
      <div class="menu-btn" onclick="tellJoke()">Random Joke</div>
      <div class="menu-btn" onclick="simpleCalculator()">Calculator</div>
      <div class="menu-btn" onclick="colorPicker()">Color Picker</div>
      <div class="menu-btn" onclick="textToASCII()">Text to ASCII</div>
      <div class="menu-btn" onclick="startMemeTemplate()">Meme Template</div>
    </div>
  `;
  const menuDiv = document.createElement('div');
  menuDiv.innerHTML = menuHTML;
  chatContainer.appendChild(menuDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// === FITUR ===
function startSticker() {
  currentMode = 'sticker';
  addMessage("Kirim foto yang mau dijadikan sticker", false);
  imageUpload.click();
}

function startSmeme() {
  currentMode = 'smeme';
  addMessage("Kirim foto untuk dibuat smeme", false);
  imageUpload.click();
}

function startBrat() {
  currentMode = 'brat';
  addMessage("Kirim foto + ketik teksnya nanti", false);
  imageUpload.click();
}

function startImageFilter() {
  currentMode = 'filter';
  addMessage("Kirim foto untuk diberi filter", false);
  imageUpload.click();
}

function startMemeTemplate() {
  addMessage("Meme template belum tersedia full. Kirim foto dulu untuk diproses sebagai meme.", false);
  currentMode = 'meme';
  imageUpload.click();
}

function generateQR() {
  const text = prompt("Masukkan teks / link untuk dibuat QR Code:");
  if (!text) return;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
  addMessage("QR Code berhasil dibuat:", false);
  addImageToChat(qrUrl, false);
}

function tellJoke() {
  const jokes = [
    "Kenapa programmer suka gelap? Karena light terlalu berat.",
    "HTML, CSS, JS jalan bareng, tiba-tiba CSS bilang: Gue lagi styling nih.",
    "Error 404: Sense of humor not found."
  ];
  addMessage(jokes[Math.floor(Math.random() * jokes.length)], false);
}

function simpleCalculator() {
  const expr = prompt("Masukkan perhitungan (contoh: 25 * 4):");
  if (!expr) return;
  try {
    const result = eval(expr);
    addMessage(`Hasil: ${result}`, false);
  } catch (e) {
    addMessage("Perhitungan tidak valid.", false);
  }
}

function colorPicker() {
  const color = prompt("Masukkan kode warna (contoh: #00ff88):");
  if (color) {
    addMessage(`Warna: ${color}`, false);
    const box = `<div style="background:${color}; width:100%; height:80px; border-radius:8px; margin:10px 0;"></div>`;
    const div = document.createElement('div');
    div.innerHTML = box;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

function textToASCII() {
  const text = prompt("Masukkan teks untuk diubah ke ASCII:");
  if (!text) return;
  addMessage(text.split('').join(' '), false);
}

// Handle Image Processing
imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    addImageToChat(event.target.result, true);

    setTimeout(() => {
      if (currentMode === 'sticker') {
        processSticker(event.target.result);
      } else if (currentMode === 'filter') {
        addMessage("Filter diterapkan (simulasi). Gambar sudah di proses.", false);
        addImageToChat(event.target.result, false);
      } else {
        addMessage("Foto diterima. Fitur ini masih dalam tahap pengembangan.", false);
      }
    }, 800);
  };
  reader.readAsDataURL(file);
});

function processSticker(imageSrc) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.onload = function() {
    canvas.width = 512;
    canvas.height = 512;
    ctx.drawImage(img, 0, 0, 512, 512);
    const stickerURL = canvas.toDataURL('image/png');
    addImageToChat(stickerURL, false);
    addMessage("Sticker siap. Klik kanan pada gambar → Save image as.", false);
  };
  img.src = imageSrc;
}

// Command Handler
sendBtn.addEventListener('click', () => {
  const text = userInput.value.trim();
  if (text === "") return;

  addMessage(text, true);
  userInput.value = "";

  setTimeout(() => {
    if (text.toLowerCase() === "/start") {
      addMessage("Pilih menu di bawah ini:", false);
      showMainMenu();
    } else {
      addMessage("Ketik /start untuk membuka semua menu.", false);
    }
  }, 600);
});

userInput.addEventListener('keypress', (e) => {
  if (e.key === "Enter") sendBtn.click();
});

window.onload = () => {
  addMessage("Halo, saya ArdX BOT. Ketik /start untuk melihat semua fitur.", false);
};
