(async function main() {
  const mount = document.getElementById("mount");

  // load json from extension package
  const url = chrome.runtime.getURL("identity_providers.json");
  const res = await fetch(url);
  const data = await res.json();
  const providers = Array.isArray(data?.identity_providers) ? data.identity_providers : [];

  createIdpDropdown(mount, providers, (selected) => {
    // open selected provider url in new tab
    if (selected?.url) chrome.tabs.create({ url: selected.url });
  });
})();

function createIdpDropdown(mountEl, providers, onSelect) {
  const placeholder = "choose your organization…";
  const root = document.createElement("div");
  root.className = "idpdd";
  root.innerHTML = `
    <button type="button" class="idpdd-btn" aria-haspopup="listbox" aria-expanded="false">
      <span class="idpdd-left">
        <img class="idpdd-icon" alt="" style="display:none;" />
        <span class="idpdd-title"></span>
      </span>
      <span class="idpdd-right">
        <span class="idpdd-caret" aria-hidden="true"></span>
      </span>
    </button>

    <div class="idpdd-panel" role="dialog" aria-label="identity provider chooser">
      <div class="idpdd-search">
        <input type="text" placeholder="search organization" aria-label="search identity providers" />
      </div>
      <div class="idpdd-list" role="listbox" tabindex="-1"></div>
    </div>
  `;
  mountEl.appendChild(root);

  const btn = root.querySelector(".idpdd-btn");
  const titleEl = root.querySelector(".idpdd-title");
  // const subEl = root.querySelector(".idpdd-sub");
  const rightIconEl = root.querySelector(".idpdd-icon");
  const panel = root.querySelector(".idpdd-panel");
  const searchInput = root.querySelector(".idpdd-search input");
  const listEl = root.querySelector(".idpdd-list");

  let isOpen = false;
  let selected = null;
  let activeIndex = -1;
  let filtered = providers.slice();

  function setSelected(item) {
    selected = item;
    titleEl.textContent = item?.name ?? placeholder;
    // subEl.textContent = item?.url ?? "";
    if (item?.icon_base64) {
      rightIconEl.src = item.icon_base64;
      rightIconEl.style.display = "";
    } else {
      rightIconEl.removeAttribute("src");
      rightIconEl.style.display = "none";
    }
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    panel.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
    searchInput.value = "";
    filtered = providers.slice();
    activeIndex = filtered.length ? 0 : -1;
    renderList();
    queueMicrotask(() => searchInput.focus());   
    toggleCaretRotation();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    panel.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    activeIndex = -1;
    toggleCaretRotation();
  }

  function toggleCaretRotation(){
    //Rotate Caret
    const caret = document.querySelector(".idpdd-caret");
    caret.classList.toggle("rotated");
  }

  function applyFilter(q) {
    const query = (q ?? "").trim().toLowerCase();
    if (!query) {
      filtered = providers.slice();
    } else {
      filtered = providers.filter((p) => {
        const hay = [
          p.name,
          p.url,
          p.category,
          p.search_data
        ].filter(Boolean).join(" ").toLowerCase();
        return hay.includes(query);
      });
    }
    activeIndex = filtered.length ? 0 : -1;
    renderList();
  }

  function renderList() {
    listEl.innerHTML = "";
    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.style.padding = "14px 12px";
      empty.style.color = "#666";
      empty.style.fontSize = "14px";
      empty.textContent = "no matches";
      listEl.appendChild(empty);
      return;
    }

    filtered.forEach((item, idx) => {
      const row = document.createElement("div");
      row.setAttribute("role", "option");
      row.setAttribute("data-index", String(idx));
      row.setAttribute("aria-selected", selected?.url === item.url ? "true" : "false");


      //If Category
      if (item.url == "") {
        listEl.appendChild(document.createElement("hr"));
        row.innerHTML = `
        <span class="idpdd-item-desc">
          <span class="idpdd-item-cat">hey</span>
        </span>
      `;
        row.querySelector(".idpdd-item-cat").textContent = item.category ?? "";
        row.className = "idpdd-desc";

      } //If Service Provider
      else {
        row.innerHTML = `
        ${item.icon_base64 ? `<img class="idpdd-icon" alt="" />` : `<span style="width:18px;height:18px;"></span>`}
        <span class="idpdd-item-left">
          <span class="idpdd-item-name"></span>
        </span>
      `;

        row.querySelector(".idpdd-item-name").textContent = item.name ?? "";
        row.className = "idpdd-item";

        const icon = row.querySelector("img.idpdd-icon");
        if (icon && item.icon_base64) icon.src = item.icon_base64;

        row.addEventListener("click", () => {
          setSelected(item);
          close();
          //btn.focus();
          //if (typeof onSelect === "function") onSelect(item);
        });
      }

      // Removed Category in current code
      // row.innerHTML = `
      //   <span class="idpdd-item-left">
      //     <span class="idpdd-item-name"></span>
      //     <span class="idpdd-item-cat"></span>
      //   </span>
      //   ${item.icon_base64 ? `<img class="idpdd-icon" alt="" />` : `<span style="width:18px;height:18px;"></span>`}
      // `;

      listEl.appendChild(row);

      if (idx === activeIndex) {
        row.scrollIntoView({ block: "nearest" });
      }
    });
  }

  // initial
  setSelected(null);
  renderList();

  // ui events
  btn.addEventListener("click", () => (isOpen ? close() : open()));
  searchInput.addEventListener("input", (e) => applyFilter(e.target.value));

  // keyboard
  root.addEventListener("keydown", (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      close();
      btn.focus();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filtered.length) activeIndex = Math.min(filtered.length - 1, activeIndex + 1);
      renderList();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filtered.length) activeIndex = Math.max(0, activeIndex - 1);
      renderList();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && filtered[activeIndex]) {
        const item = filtered[activeIndex];
        setSelected(item);
        close();
        btn.focus();
        if (typeof onSelect === "function") onSelect(item);
      }
      return;
    }
  });

  // close on outside click
  document.addEventListener("mousedown", (e) => {
    if (!root.contains(e.target)) close();
  });
}
