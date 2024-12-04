function removeBorderRadius(important) {
    const elements = document.querySelectorAll("*");
    elements.forEach((el) => {
      el.style.setProperty("border-radius", "0px", important ? "important" : "");
    });
  }
  
  const observer = new MutationObserver(() => {
    if (document.body.dataset.noBorderRadiusEnabled === "true") {
      const important = document.body.dataset.noBorderRadiusImportant === "true";
      removeBorderRadius(important);
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  chrome.storage.local.get(["globalSettings", location.hostname], (data) => {
    const globalSettings = data.globalSettings || { autoEnable: false };
    const settings = data[location.hostname] || { enabled: globalSettings.autoEnable, important: false };
  
    document.body.dataset.noBorderRadiusEnabled = settings.enabled;
    document.body.dataset.noBorderRadiusImportant = settings.important;
  
    if (settings.enabled) {
      removeBorderRadius(settings.important);
    }
  });
  