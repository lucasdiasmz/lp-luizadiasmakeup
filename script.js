/* Luiza Dias Makeup — interações da landing page (sem dependências) */
(function () {
    "use strict";

    /* ===== Configuração: troque pelos dados reais da Luiza ===== */
    var CONFIG = {
        whatsapp: "553799669374", // DDI + DDD + número, só dígitos: +55 37 9966-9374
        instagram: "https://instagram.com/", // Ex.: https://instagram.com/luizadiasmakeup
        mensagemPadrao: "Oi, Luiza! Vim pelo site e queria consultar uma data."
    };

    var doc = document.documentElement;
    doc.classList.add("js");

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function waLink(texto) {
        return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(texto);
    }

    /* ---------- Links de WhatsApp e Instagram ---------- */
    document.querySelectorAll("[data-wa]").forEach(function (a) {
        a.href = waLink(CONFIG.mensagemPadrao);
    });
    document.querySelectorAll("[data-instagram]").forEach(function (a) {
        a.href = CONFIG.instagram;
    });

    /* ---------- Menu mobile ---------- */
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("menu-principal");

    function setMenu(open) {
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
        nav.classList.toggle("is-open", open);
    }

    toggle.addEventListener("click", function () {
        setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (e) {
        if (e.target.closest("a, button")) setMenu(false);
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && nav.classList.contains("is-open")) {
            setMenu(false);
            toggle.focus();
        }
    });

    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (mq) {
        if (mq.matches) setMenu(false);
    });

    /* ---------- Header com borda ao rolar + botão flutuante após o hero ---------- */
    var hero = document.getElementById("inicio");
    var fab = document.querySelector(".fab");

    function onScroll() {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
            var passouDoHero = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
            fab.classList.toggle("is-visible", passouDoHero);
            fab.setAttribute("aria-hidden", String(!passouDoHero));
            fab.tabIndex = passouDoHero ? 0 : -1;
        }).observe(hero);
    }

    /* ---------- Link ativo no menu ---------- */
    var navLinks = Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']"));
    if ("IntersectionObserver" in window) {
        var linkObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (a) {
                    var ativo = a.getAttribute("href") === "#" + entry.target.id;
                    if (ativo) a.setAttribute("aria-current", "true");
                    else a.removeAttribute("aria-current");
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px" });

        navLinks.forEach(function (a) {
            var alvo = document.querySelector(a.getAttribute("href"));
            if (alvo) linkObserver.observe(alvo);
        });
    }

    /* ---------- Animações de entrada ---------- */
    var animados = document.querySelectorAll(".reveal, .schedule, .calendar-art");
    var steps = document.querySelector(".steps-list");

    if (reduceMotion || !("IntersectionObserver" in window)) {
        animados.forEach(function (el) { el.classList.add("is-visible"); });
        if (steps) steps.style.setProperty("--progress", 1);
    } else {
        var revealObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

        animados.forEach(function (el, i) {
            // pequeno escalonamento entre irmãos
            var irmaos = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
            el.style.transitionDelay = Math.min(irmaos, 4) * 80 + "ms";
            revealObserver.observe(el);
        });

        if (steps) {
            new IntersectionObserver(function (entries, obs) {
                if (entries[0].isIntersecting) {
                    steps.style.setProperty("--progress", 1);
                    obs.disconnect();
                }
            }, { threshold: 0.4 }).observe(steps);
        }
    }

    /* ---------- Pop-up de agendamento ---------- */
    var dialog = document.getElementById("agendamento");
    var form = dialog.querySelector("form");
    var ultimoFoco = null;

    function abrirDialog() {
        ultimoFoco = document.activeElement;
        if (typeof dialog.showModal === "function") {
            dialog.showModal();
        } else {
            dialog.setAttribute("open", "");
        }
        document.getElementById("f-nome").focus();
    }

    function fecharDialog() {
        if (typeof dialog.close === "function") dialog.close();
        else dialog.removeAttribute("open");
    }

    dialog.addEventListener("close", function () {
        if (ultimoFoco) ultimoFoco.focus();
    });

    document.querySelectorAll("[data-open-dialog]").forEach(function (btn) {
        btn.setAttribute("aria-haspopup", "dialog");
        btn.addEventListener("click", abrirDialog);
    });

    dialog.querySelector("[data-close-dialog]").addEventListener("click", fecharDialog);

    // Fecha ao clicar fora do formulário
    dialog.addEventListener("click", function (e) {
        if (e.target === dialog) fecharDialog();
    });

    // Data mínima = hoje
    var campoData = document.getElementById("f-data");
    var hoje = new Date();
    hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
    campoData.min = hoje.toISOString().slice(0, 10);

    // Máscara simples de telefone: (37) 99999-9999
    var campoTel = document.getElementById("f-tel");
    campoTel.addEventListener("input", function () {
        var d = campoTel.value.replace(/\D/g, "").slice(0, 11);
        var out = d;
        if (d.length > 2) out = "(" + d.slice(0, 2) + ") " + d.slice(2);
        if (d.length > 7) out = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4);
        campoTel.value = out;
    });

    function setErro(input, msg) {
        var erro = document.getElementById(input.getAttribute("aria-describedby"));
        erro.textContent = msg || "";
        if (msg) input.setAttribute("aria-invalid", "true");
        else input.removeAttribute("aria-invalid");
        return !msg;
    }

    function validar() {
        var nome = document.getElementById("f-nome");
        var digitos = campoTel.value.replace(/\D/g, "");
        var ok = true;

        ok = setErro(nome, nome.value.trim().split(/\s+/).length < 2 ? "Digite seu nome e sobrenome." : "") && ok;
        ok = setErro(campoTel, digitos.length < 10 ? "Digite o telefone com DDD." : "") && ok;
        ok = setErro(campoData,
            !campoData.value ? "Escolha a data do evento." :
            campoData.value < campoData.min ? "Escolha uma data a partir de hoje." : "") && ok;

        if (!ok) {
            var primeiro = form.querySelector("[aria-invalid='true']");
            if (primeiro) primeiro.focus();
        }
        return ok;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validar()) return;

        var partes = campoData.value.split("-");
        var dataBR = partes[2] + "/" + partes[1] + "/" + partes[0];
        var texto = CONFIG.mensagemPadrao +
            "\n\nNome: " + document.getElementById("f-nome").value.trim() +
            "\nWhatsApp: " + campoTel.value +
            "\nData do evento: " + dataBR;

        window.open(waLink(texto), "_blank", "noopener");
        form.reset();
        fecharDialog();
    });

    // Limpa o erro do campo assim que a pessoa corrige
    form.querySelectorAll("input").forEach(function (input) {
        input.addEventListener("input", function () {
            if (input.getAttribute("aria-invalid") === "true") setErro(input, "");
        });
    });
})();
