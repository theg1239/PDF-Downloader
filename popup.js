document.getElementById('downloadBtn').addEventListener('click', () => {
    const startPage = parseInt(document.getElementById('startPage').value, 10);
    const endPage = parseInt(document.getElementById('endPage').value, 10);

    if (startPage > endPage) {
        alert("Start page cannot be greater than end page.");
        return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: downloadPDFWithRange,
            args: [startPage, endPage]
        });
    });
});

function downloadPDFWithRange(startPage, endPage) {
    window.postMessage({ type: "DOWNLOAD_PDF", startPage, endPage }, "*");
}
