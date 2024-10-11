(function() {
  'use strict';

  function rescale(imgWidth, imgHeight, pdfWidth, pdfHeight) {
      let widthRatio = pdfWidth / imgWidth;
      let heightRatio = pdfHeight / imgHeight;
      let scale = Math.min(widthRatio, heightRatio);
      return [imgWidth * scale, imgHeight * scale];
  }

  function imageToBase64(img) {
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
      return canvas.toDataURL("image/jpeg", 0.3); 
  }

  function downloadPDF(startPage, endPage) {
      try {
          const jsPDF = window.jspdf.jsPDF;
          const pdf = new jsPDF({
              orientation: "portrait",
              unit: "mm",
              format: "a4",
              compressPdf: true 
          });
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const elements = document.getElementsByTagName("img");
          let currentPage = 0;

          for (let img of elements) {
              if (!/^blob:/.test(img.src)) continue;
              currentPage++;
              if (currentPage < startPage || currentPage > endPage) continue;

              let imgData = imageToBase64(img);
              let [newWidth, newHeight] = rescale(img.naturalWidth, img.naturalHeight, pdfWidth, pdfHeight);

              let xPos = (pdfWidth - newWidth) / 2;
              let yPos = (pdfHeight - newHeight) / 2;

              pdf.addImage(imgData, "JPEG", xPos, yPos, newWidth, newHeight, undefined, 'FAST'); 
              if (currentPage < endPage) pdf.addPage();
          }

          pdf.save("download_compressed.pdf", { returnPromise: true }).then(function() {
              console.log("PDF saved successfully with compression.");
          }).catch(function(err) {
              console.error("Error saving compressed PDF:", err);
          });
      } catch (e) {
          console.error("Error generating PDF:", e);
      }
  }

  window.addEventListener("message", (event) => {
      if (event.data.type === "DOWNLOAD_PDF") {
          downloadPDF(event.data.startPage, event.data.endPage);
      }
  });

})();
