/* =========================================================================
   BURN-1 SYSTEMS // BRUTALIST AUTONOMOUS CHATBOT WIDGET
   ========================================================================= */

(function() {
    function initChatbot() {
        if (document.getElementById('burn1-chatbot-modal')) return;

        // 1. Inject Chatbot CSS
        const style = document.createElement('style');
        style.innerHTML = `
            #burn1-chatbot-trigger {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 9999;
                background: #00f3ff;
                color: #000000;
                font-family: 'Orbitron', sans-serif;
                font-weight: 900;
                font-size: 13px;
                padding: 12px 18px;
                border: 3px solid #00f3ff;
                box-shadow: 4px 4px 0px #ffffff;
                cursor: pointer;
                transition: all 0.15s ease-in-out;
                text-transform: uppercase;
            }
            #burn1-chatbot-trigger:hover {
                background: #39ff14;
                border-color: #39ff14;
                transform: translate(-2px, -2px);
                box-shadow: 6px 6px 0px #00f3ff;
            }

            #burn1-chatbot-modal {
                position: fixed;
                bottom: 80px;
                right: 24px;
                z-index: 99999;
                width: 360px;
                max-width: calc(100vw - 32px);
                height: 480px;
                background: #0a0e17;
                border: 4px solid #00f3ff;
                box-shadow: 8px 8px 0px #00f3ff;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                font-family: 'Share Tech Mono', monospace;
            }

            #burn1-chatbot-modal.hidden {
                display: none !important;
            }

            .bot-msg {
                background: #000000;
                border: 2px solid #00f3ff;
                color: #00f3ff;
                padding: 10px 12px;
                font-size: 12px;
                margin-bottom: 10px;
                border-radius: 4px;
            }
            .user-msg {
                background: #39ff14;
                color: #000000;
                font-weight: bold;
                padding: 10px 12px;
                font-size: 12px;
                margin-bottom: 10px;
                border-radius: 4px;
                align-self: flex-end;
                text-align: right;
            }

            .chip-btn {
                background: #000000;
                border: 1px solid #00f3ff;
                color: #00f3ff;
                font-size: 10px;
                padding: 4px 8px;
                cursor: pointer;
                transition: all 0.1s;
            }
            .chip-btn:hover {
                background: #00f3ff;
                color: #000000;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);

        // 2. Inject Trigger Button & Modal Container
        const container = document.createElement('div');
        container.innerHTML = `
            <button id="burn1-chatbot-trigger" onclick="window.toggleBurn1Chatbot()">
                🤖 BURN-1 ASSISTANT <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1"></span>
            </button>

            <div id="burn1-chatbot-modal" class="hidden">
                <!-- HEADER -->
                <div class="bg-black p-3 border-b-2 border-cyan-400 flex justify-between items-center text-xs font-bold font-mono">
                    <span class="text-white">🤖 BURN-1 BOT // ZERO-CONTACT</span>
                    <button onclick="window.toggleBurn1Chatbot()" class="text-cyan-400 font-black hover:text-red-400 text-base px-2 py-1 bg-slate-900 border border-cyan-400 cursor-pointer">✕</button>
                </div>

                <!-- CHAT BODY -->
                <div id="bot-messages" class="flex-grow p-3 overflow-y-auto flex flex-col">
                    <div class="bot-msg">
                        <strong>[SYSTEM]:</strong> Welcome to Burn-1 Systems. How can I assist your deployment today? Select a topic or type a question.
                    </div>
                </div>

                <!-- QUICK CHIPS -->
                <div class="p-2 bg-black border-t border-cyan-500/30 flex flex-wrap gap-1">
                    <button class="chip-btn" onclick="window.sendBurn1Chip('What is $50 Flat?')">$50 Pricing</button>
                    <button class="chip-btn" onclick="window.sendBurn1Chip('VIP Vault Access')">VIP Vault</button>
                    <button class="chip-btn" onclick="window.sendBurn1Chip('Local AI Setup')">Local AI</button>
                    <button class="chip-btn" onclick="window.sendBurn1Chip('Go to Onboarding')">Onboarding</button>
                </div>

                <!-- INPUT FIELD -->
                <div class="p-2 bg-black border-t-2 border-cyan-400 flex gap-2">
                    <input type="text" id="bot-input" placeholder="Type query..." onkeypress="if(event.key==='Enter') window.sendBurn1UserMsg()" class="w-full bg-black border border-cyan-400 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400">
                    <button onclick="window.sendBurn1UserMsg()" class="bg-cyan-400 text-black font-bold px-3 text-xs uppercase hover:bg-emerald-400">SEND</button>
                </div>
            </div>
        `;
        document.body.appendChild(container);
    }

    window.toggleBurn1Chatbot = function() {
        const modal = document.getElementById('burn1-chatbot-modal');
        if (modal) {
            modal.classList.toggle('hidden');
        }
    };

    window.sendBurn1Chip = function(text) {
        const input = document.getElementById('bot-input');
        if (input) {
            input.value = text;
            window.sendBurn1UserMsg();
        }
    };

    window.sendBurn1UserMsg = function() {
        const input = document.getElementById('bot-input');
        if (!input) return;
        const msg = input.value.trim();
        if (!msg) return;

        const msgs = document.getElementById('bot-messages');
        
        // Append User Msg
        const uDiv = document.createElement('div');
        uDiv.className = 'user-msg';
        uDiv.innerText = msg;
        msgs.appendChild(uDiv);
        input.value = '';

        // Bot Response Logic
        setTimeout(() => {
            const bDiv = document.createElement('div');
            bDiv.className = 'bot-msg';

            const query = msg.toLowerCase();
            if (query.includes('50') || query.includes('price') || query.includes('cost')) {
                bDiv.innerHTML = `<strong>[SYSTEM]:</strong> Everything in the Burn-1 Vault is a flat $50 one-time fee. No recurring SaaS drain. You buy the code, you own the infrastructure.`;
            } else if (query.includes('vip') || query.includes('vault') || query.includes('masterclass')) {
                bDiv.innerHTML = `<strong>[SYSTEM]:</strong> Enter the VIP Vault masterclasses at <a href="vip_vault.html" class="underline text-emerald-400 font-bold">burn-1.com/vip_vault.html</a>.`;
            } else if (query.includes('kiosk') || query.includes('subdomain') || query.includes('qr')) {
                bDiv.innerHTML = `<strong>[SYSTEM]:</strong> Kiosk packages provide wildcard subdomains (yourname.burn-1.com), PayPal webhooks, and SVG QR sticker generator tools.`;
            } else if (query.includes('ai') || query.includes('local') || query.includes('ollama')) {
                bDiv.innerHTML = `<strong>[SYSTEM]:</strong> Our Privacy-First Local AI Vault configures air-gapped LLMs on your internal hardware with zero cloud leaks. Access at <a href="privacy_first_protocol.html" class="underline text-emerald-400 font-bold">privacy_first_protocol.html</a>.`;
            } else if (query.includes('onboard') || query.includes('receipt') || query.includes('key')) {
                bDiv.innerHTML = `<strong>[SYSTEM]:</strong> Activate receipt keys and download assets directly at <a href="onboarding.html" class="underline text-emerald-400 font-bold">burn-1.com/onboarding.html</a>.`;
            } else {
                bDiv.innerHTML = `<strong>[SYSTEM]:</strong> Query received. All assets are flat $50 standalone zip downloads. Visit our <a href="onboarding.html" class="underline text-emerald-400 font-bold">Onboarding Portal</a> for instant dispatch.`;
            }

            msgs.appendChild(bDiv);
            msgs.scrollTop = msgs.scrollHeight;
        }, 400);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
})();
