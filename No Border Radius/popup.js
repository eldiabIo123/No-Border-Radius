const toggleButton = document.getElementById("toggle");
const importantCheckbox = document.getElementById("important");
const autoEnableCheckbox = document.getElementById("autoEnable");

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  const url = new URL(tab.url);
  const domain = url.hostname;

  chrome.storage.local.get(["globalSettings", domain], (data) => {
    const globalSettings = data.globalSettings || { autoEnable: false };
    const settings = data[domain] || { enabled: globalSettings.autoEnable, important: false };

    toggleButton.textContent = settings.enabled ? "Wyłącz" : "Włącz";
    importantCheckbox.checked = settings.important;

    autoEnableCheckbox.checked = globalSettings.autoEnable;
  });
});

toggleButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    const url = new URL(tab.url);
    const domain = url.hostname;

    chrome.storage.local.get(["globalSettings", domain], (data) => {
      const globalSettings = data.globalSettings || { autoEnable: false };
      const settings = data[domain] || { enabled: globalSettings.autoEnable, important: false };

      const newSettings = { ...settings, enabled: !settings.enabled };
      chrome.storage.local.set({ [domain]: newSettings }, () => {
        toggleButton.textContent = newSettings.enabled ? "Wyłącz" : "Włącz";
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: toggleExtension,
          args: [newSettings.enabled],
        });
      });
    });
  });
});

importantCheckbox.addEventListener("change", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    const url = new URL(tab.url);
    const domain = url.hostname;

    chrome.storage.local.get(["globalSettings", domain], (data) => {
      const globalSettings = data.globalSettings || { autoEnable: false };
      const settings = data[domain] || { enabled: globalSettings.autoEnable, important: false };

      const newSettings = { ...settings, important: importantCheckbox.checked };
      chrome.storage.local.set({ [domain]: newSettings }, () => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: updateImportant,
          args: [importantCheckbox.checked],
        });
      });
    });
  });
});

autoEnableCheckbox.addEventListener("change", () => {
  const autoEnable = autoEnableCheckbox.checked;
  chrome.storage.local.get(["globalSettings"], (data) => {
    const globalSettings = { ...data.globalSettings, autoEnable };
    chrome.storage.local.set({ globalSettings }, () => {
      console.log("Globalne automatyczne włączanie ustawione na:", autoEnable);
    });
  });
});

function toggleExtension(enabled) {
  document.body.dataset.noBorderRadiusEnabled = enabled;
}

function updateImportant(important) {
  document.body.dataset.noBorderRadiusImportant = important;
}
